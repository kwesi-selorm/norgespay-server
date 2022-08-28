import express, { NextFunction } from "express";
import Session from "../models/session-model";
import { AppError } from "./../utils/error-classes";

async function verifyCookies(
    req: express.Request,
    _res: express.Response,
    next: NextFunction,
) {
    if (!req.cookies) {
        next(new AppError("Not authorized", 403));
        return;
    }

    if (req.cookies) {
        const sessionId = req.sessionID;
        const validSession = await Session.findOne({ _id: sessionId });
        if (!validSession) {
            next(
                new AppError("Session expired, redirecting to login page", 401),
            );
            return;
        }
    }
    next();
}

export default verifyCookies;
