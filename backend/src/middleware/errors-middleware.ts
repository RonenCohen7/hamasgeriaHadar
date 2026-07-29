import { NextFunction, Request, Response } from "express";
import { RouteNotFoundError } from "../models/client-errors";

import { appConfig } from "../utils/app-config";
import { StatusCode } from "../models/enum";


class ErrorMiddleware {

    public routeNotFound(request: Request, response: Response, next: NextFunction) {
        next(new RouteNotFoundError(request.originalUrl));
    }


    public catchAll(err: any, request: Request, response: Response, next: NextFunction) {
        console.error(err);

        const status = err.status || StatusCode.InternalServerError;

        const isServerError = status >= 500 && status <= 599;

        const message = appConfig.isProduction && isServerError ? "Some Error, Please try again" : err.message;

        response.status(status).json({ message });

    }

}


export const errorMiddleware = new ErrorMiddleware();