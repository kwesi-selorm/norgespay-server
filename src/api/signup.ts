import { AppError } from "./../utils/classes/AppError";
import express from "express";
const signupRouter = express.Router();
import User from "../models/user-model";
import { generatePassword } from "../fns/password-fns";
import { signupParser } from "../parsers";

//SIGNUP//
signupRouter.post("/", async (req, res, next) => {
  const result = signupParser(req, next);
  if (result) {
    const { email, username, password } = result;
    const exists =
      (await User.exists({ email: email })) ||
      (await User.exists({ username: username }));
    if (exists) {
      return next(new AppError("User already exists", 403)); //Forbidden
    }
    try {
      const passwordHash = await generatePassword(password);
      const newUser = new User({ email, username, passwordHash });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(error.message, 400));
      }
    }
  }
});

export default signupRouter;
