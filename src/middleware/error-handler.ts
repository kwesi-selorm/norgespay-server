interface APIError {
  message: string;
  status: number;
}
import express, { NextFunction } from "express";

function errorHandler(
  error: APIError,
  _req: express.Request,
  res: express.Response,
  next: NextFunction,
) {
  res.status(error.status || 500).json({ message: error.message });
  next();
}

export default errorHandler;
