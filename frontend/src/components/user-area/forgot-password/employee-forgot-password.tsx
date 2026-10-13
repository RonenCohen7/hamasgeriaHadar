import "../../customers-area/forgot-password/forgot-password.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useTitle } from "../../utils/UseTitle";
import { dialogService } from "../../service/dialogService";
import { authService } from "../../service/authService";


export function EmployeeForgotPassword() {

    const { t, i18n } = useTranslation();
    const isHebrew = i18n.language === "he";

    useTitle(t("employeeForgot.pageTitle"));

    const navigate = useNavigate();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetToken, setResetToken] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    async function showError(key: string) {
        await dialogService.error(t("employeeForgot.errorTitle"), t(`employeeForgot.${key}`));
    }


    // =========================================
    // STEP 1 - SEND CODE
    // =========================================

    async function sendCode() {

        const cleanEmail = email.trim();

        if (!cleanEmail || !cleanEmail.includes("@")) {
            await showError("invalidEmail");
            return;
        }

        setIsSubmitting(true);

        try {
            await authService.requestPasswordResetCode(cleanEmail);
            setCode("");
            setStep(2);
            await dialogService.success("✓", t("employeeForgot.codeSent"));

        } catch (err: any) {
            const status = err?.response?.status;
            const message: string = err?.response?.data?.message ?? "";

            if (status === 404) await showError("emailNotFound");
            else if (status === 429) await showError("tooMany");
            else if (status === 400 && message.includes("minute")) await showError("tooSoon");
            else if (status === 400) await showError("invalidEmail");
            else await showError("generic");

        } finally {
            setIsSubmitting(false);
        }
    }


    // =========================================
    // STEP 2 - VERIFY CODE
    // =========================================

    async function verifyCode() {

        if (!/^\d{6}$/.test(code.trim())) {
            await showError("codeRequired");
            return;
        }

        setIsSubmitting(true);

        try {
            const token = await authService.verifyPasswordResetCode(email.trim(), code.trim());
            setResetToken(token);
            setStep(3);

        } catch (err: any) {
            const status = err?.response?.status;

            if (status === 400) await showError("invalidCode");
            else if (status === 401) await showError("codeExpired");
            else if (status === 429) await showError("tooMany");
            else await showError("generic");

        } finally {
            setIsSubmitting(false);
        }
    }


    // =========================================
    // STEP 3 - NEW PASSWORD
    // =========================================

    async function changePassword() {

        if (newPassword.length < 6) {
            await showError("passwordTooShort");
            return;
        }

        if (newPassword !== confirmPassword) {
            await showError("passwordsMismatch");
            return;
        }

        if (!resetToken) {
            setStep(1);
            return;
        }

        setIsSubmitting(true);

        try {
            await authService.resetPassword(resetToken, newPassword);
            await dialogService.success("✓", t("employeeForgot.success"));
            navigate("/login");

        } catch (err: any) {
            const status = err?.response?.status;

            if (status === 401) {
                await showError("sessionExpired");
                setResetToken(null);
                setStep(1);
            }
            else if (status === 400) await showError("passwordTooShort");
            else if (status === 429) await showError("tooMany");
            else await showError("generic");

        } finally {
            setIsSubmitting(false);
        }
    }


    return (

        <section className="ForgotPassword" dir={isHebrew ? "rtl" : "ltr"}>

            <div className="forgot-password-card">

                <span className="forgot-password-badge">
                    {t("employeeForgot.badge")}
                </span>

                <h1>{t("employeeForgot.title")}</h1>


                {step === 1 && (
                    <>
                        <p>{t("employeeForgot.step1Text")}</p>

                        <div className="forgot-password-field">
                            <label>{t("employeeForgot.email")}</label>
                            <input
                                type="email"
                                dir="ltr"
                                value={email}
                                placeholder="example@email.com"
                                onChange={e => setEmail(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && sendCode()}
                            />
                        </div>

                        <button
                            type="button"
                            className="forgot-password-main-button"
                            onClick={sendCode}
                            disabled={isSubmitting}
                        >
                            {t("employeeForgot.sendCode")}
                        </button>
                    </>
                )}


                {step === 2 && (
                    <>
                        <p>
                            {t("employeeForgot.step2Text")} <strong dir="ltr">{email.trim()}</strong>
                        </p>

                        <div className="forgot-password-field">
                            <label>{t("employeeForgot.code")}</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                dir="ltr"
                                value={code}
                                placeholder="000000"
                                onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
                                onKeyDown={e => e.key === "Enter" && verifyCode()}
                            />
                        </div>

                        <button
                            type="button"
                            className="forgot-password-main-button"
                            onClick={verifyCode}
                            disabled={isSubmitting}
                        >
                            {t("employeeForgot.verifyCode")}
                        </button>

                        <button
                            type="button"
                            className="forgot-password-back"
                            onClick={sendCode}
                            disabled={isSubmitting}
                        >
                            {t("employeeForgot.resendCode")}
                        </button>
                    </>
                )}


                {step === 3 && (
                    <>
                        <p>{t("employeeForgot.step3Text")}</p>

                        <div className="forgot-password-field">
                            <label>{t("employeeForgot.newPassword")}</label>
                            <input
                                type="password"
                                autoComplete="new-password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="forgot-password-field">
                            <label>{t("employeeForgot.confirmPassword")}</label>
                            <input
                                type="password"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && changePassword()}
                            />
                        </div>

                        <button
                            type="button"
                            className="forgot-password-main-button"
                            onClick={changePassword}
                            disabled={isSubmitting}
                        >
                            {t("employeeForgot.changePassword")}
                        </button>
                    </>
                )}


                <button
                    type="button"
                    className="forgot-password-back"
                    onClick={() => navigate("/login")}
                >
                    {isHebrew ? "→" : "←"} {t("employeeForgot.backToLogin")}
                </button>

            </div>

        </section>
    );
}
