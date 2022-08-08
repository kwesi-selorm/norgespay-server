import jwt from "jsonwebtoken";
import express from "express";
import User from "../models/user-model";
import { validatePassword } from "../fns/password-fns";
import { SECRET } from "../utils/config";
import { LoginRequest } from "../types/types";
import { loginParser } from "../parsers";
import { AppError } from "../utils/classes/AppError";

const loginRouter = express.Router();

loginRouter.post("/", async (req: LoginRequest, res, next) => {
  const result = loginParser(req, next);
  if (result) {
    const { username, password } = result;

    try {
      const user = await User.findOne({ username });
      if (user == null) {
        return next(new AppError("User not found", 404));
      }
      const match = await validatePassword(password, user.passwordHash);
      if (!match) {
        return res.status(401).send({ message: "Invalid username or password" });
      }
      const tokenUser = {
        username,
        id: user._id,
      };
      const token = jwt.sign(tokenUser, SECRET);
      return res.status(200).send({ token, username: user.username, id: user._id });
    } catch (error) {
      if (error instanceof Error)
        next(new AppError("Login failed, possibly invalid username or password", 500));
    }
  }
});

export default loginRouter;
