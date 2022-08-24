import express, { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../utils/config";
import { AppError } from "./../utils/error-classes";

function verifyJWT(
  req: express.Request,
  _res: express.Response,
  next: NextFunction,
) {
  let token = "";
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (typeof authHeader === "string" && !authHeader?.startsWith("Bearer "))
    return next(new AppError("Unauthorized", 401));

  if (typeof authHeader === "string") token = authHeader?.split(" ")[1];

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err) => {
    if (err) next(new AppError(`Forbidden: ${err.message}`, 403));
    next();
  });
}

export default verifyJWT;
