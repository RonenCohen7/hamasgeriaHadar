import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";

import { dal } from "../utils/dal";
import { appConfig } from "../utils/app-config";
import { sanitizeText } from "../utils/sanitize";
import { mailService } from "./mail-service";
import { ValidationError, UnauthorizedError } from "../models/client-errors";
import { StatusCode } from "../models/enum";


const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESET_TOKEN_PURPOSE = "employee-password-reset";

type PendingCode = {
    idAccount: number;
    codeHash: string;
    expiresAt: number;
    sentAt: number;
    attempts: number;
};


class EmailNotFoundError {
    public status = StatusCode.NotFound;
    public message = "Email not found";
}


class EmployeePasswordResetService {

    // In-memory: codes are lost on backend restart (the employee simply requests a new one).
    private pendingCodes = new Map<string, PendingCode>();


    private hashCode(email: string, code: string): string {
        return crypto
            .createHmac("sha256", process.env.JWT_SECRET!)
            .update(`${email}:${code}`)
            .digest("hex");
    }


    private cleanEmail(email: string): string {
        return sanitizeText(String(email ?? "")).trim().toLowerCase();
    }


    // ============================================================
    // STEP 1 - SEND CODE TO EMAIL
    // ============================================================
    public async requestCode(email: string): Promise<void> {

        const cleanEmail = this.cleanEmail(email);

        if (!cleanEmail || !cleanEmail.includes("@")) {
            throw new ValidationError("Valid email is required");
        }

        const sql = `
            SELECT a.id_account AS idAccount, u.first_name AS firstName
            FROM accounts a
            INNER JOIN users u ON u.id_account = a.id_account
            WHERE a.email = ?
              AND a.account_type = 'employee'
              AND a.is_active = TRUE
              AND u.is_active = TRUE
        `;

        const rows = await dal.execute(sql, [cleanEmail]) as RowDataPacket[];
        const employee = rows[0];

        if (!employee) {
            throw new EmailNotFoundError();
        }

        const existing = this.pendingCodes.get(cleanEmail);
        if (existing && Date.now() - existing.sentAt < RESEND_COOLDOWN_MS) {
            throw new ValidationError("A code was sent less than a minute ago");
        }

        const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");

        this.pendingCodes.set(cleanEmail, {
            idAccount: Number(employee.idAccount),
            codeHash: this.hashCode(cleanEmail, code),
            expiresAt: Date.now() + CODE_TTL_MS,
            sentAt: Date.now(),
            attempts: 0
        });

        if (!mailService.isConfigured() && appConfig.isDevelopment) {
            console.log(`[DEV] Employee password reset code for ${cleanEmail}: ${code}`);
            return;
        }

        try {
            await mailService.send(
                cleanEmail,
                "המסגריה - קוד לאיפוס סיסמה",
                this.buildHtml(employee.firstName, code),
                `שלום ${employee.firstName},\nקוד האיפוס שלך: ${code}\nהקוד בתוקף ל-10 דקות.\nאם לא ביקשת לאפס סיסמה, אפשר להתעלם מהמייל.`
            );
        } catch (err) {
            this.pendingCodes.delete(cleanEmail);
            throw err;
        }
    }


    // ============================================================
    // STEP 2 - VERIFY CODE -> SHORT-LIVED RESET TOKEN
    // ============================================================
    public verifyCode(email: string, code: string): string {

        const cleanEmail = this.cleanEmail(email);
        const cleanCode = String(code ?? "").trim();

        const pending = this.pendingCodes.get(cleanEmail);

        if (!pending || pending.expiresAt < Date.now()) {
            this.pendingCodes.delete(cleanEmail);
            throw new UnauthorizedError("Code expired, please request a new one");
        }

        pending.attempts++;

        const expected = Buffer.from(pending.codeHash, "hex");
        const actual = Buffer.from(this.hashCode(cleanEmail, cleanCode), "hex");

        if (!crypto.timingSafeEqual(expected, actual)) {
            if (pending.attempts >= MAX_ATTEMPTS) {
                this.pendingCodes.delete(cleanEmail);
                throw new UnauthorizedError("Too many attempts, please request a new code");
            }
            throw new ValidationError("Invalid code");
        }

        this.pendingCodes.delete(cleanEmail);

        return jwt.sign(
            { idAccount: pending.idAccount, purpose: RESET_TOKEN_PURPOSE },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
        );
    }


    // ============================================================
    // STEP 3 - SET NEW PASSWORD
    // ============================================================
    public async resetPassword(resetToken: string, newPassword: string): Promise<void> {

        if (!newPassword || newPassword.length < 6) {
            throw new ValidationError("Password must contain at least 6 characters");
        }

        let payload: { idAccount: number; purpose: string };
        try {
            payload = jwt.verify(resetToken, process.env.JWT_SECRET!) as typeof payload;
        } catch {
            throw new UnauthorizedError("Reset session expired, please start again");
        }

        if (payload.purpose !== RESET_TOKEN_PURPOSE) {
            throw new UnauthorizedError("Invalid reset token");
        }

        const passwordHash = await bcrypt.hash(newPassword, 12);

        await dal.execute(
            `UPDATE accounts SET password = ? WHERE id_account = ? AND account_type = 'employee'`,
            [passwordHash, payload.idAccount]
        );

        await dal.execute(
            `UPDATE users SET password = ? WHERE id_account = ?`,
            [passwordHash, payload.idAccount]
        );
    }


    private buildHtml(firstName: string, code: string): string {
        return `
            <div dir="rtl" style="font-family: Arial, sans-serif; text-align: right; color: #1f2d3d;">
                <h2>המסגריה - פאב הדר</h2>
                <p>שלום ${sanitizeText(firstName)},</p>
                <p>קיבלנו בקשה לאיפוס הסיסמה שלך למערכת הניהול.</p>
                <p>קוד האיפוס שלך:</p>
                <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 16px 0;">${code}</p>
                <p>הקוד בתוקף ל-10 דקות.</p>
                <p style="color: #6c757d;">אם לא ביקשת לאפס סיסמה, אפשר להתעלם מהמייל.</p>
            </div>
        `;
    }

}


export const employeePasswordResetService = new EmployeePasswordResetService();
