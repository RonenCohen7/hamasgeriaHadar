import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


export function verifyToken(request: Request,response: Response,next: NextFunction): void {

    const authorization = request.header("authorization");

    if (!authorization) {
        response.sendStatus(401);
        return;
    }

    const [scheme, rawToken] = authorization.trim().split(/\s+/);

    if (scheme !== "Bearer" || !rawToken) {
        response.sendStatus(401);
        return;
    }

    const token = rawToken.trim();

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as {
            idUser:number,
            role:string
        }
        (request as any).user = payload;
        next();
    }
    catch (err: any) {
        console.log("JWT verification failed:", err.message);
        response.sendStatus(401);
    }
}