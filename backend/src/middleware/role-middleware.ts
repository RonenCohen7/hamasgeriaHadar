import { Request, Response, NextFunction } from "express";



export function allowRoles(...roles: string[]){

    return (
        request:Request,
        response:Response,
        next:NextFunction
    ): void => {
        const user = (request as any).user
        if(!user) {
            response.sendStatus(401);
            return;
        }
        if(!roles.includes(user.role)){
            response.sendStatus(403);
            return;
        }
        next();
    }
}
