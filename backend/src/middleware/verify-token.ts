import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


export function verifyToken(request: Request,response: Response,next: NextFunction): void {

    const authorization = request.header("authorization");

    let token: string | undefined

    if (!authorization) {
        response.sendStatus(401);
        return;
    }

    const [scheme, rawToken] = authorization.trim().split(/\s+/);

    if (scheme !== "Bearer" || !rawToken) {
        token = rawToken.trim();
    }


    if(!token) {
        token  = request.cookies?.accessToken;
    }
    
    if(!token) {
        response.sendStatus(401);
        return;
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as {
            idUser:number,
            idAccount?: number,
            role:string,
            accountType?: string;
        }

        (request as any).user = payload;
        next();
    }
    catch (err: any) {
        console.log("JWT verification failed:", err.message);
        
        response.sendStatus(401);
    }
}