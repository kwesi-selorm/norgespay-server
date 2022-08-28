/* eslint-disable @typescript-eslint/no-explicit-any */
"use strict";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express from "express";
import session from "express-session";
import mongoose, { ConnectOptions } from "mongoose";
import morgan from "morgan";
import contributorRouter from "./api/contributors";
import loginRouter from "./api/login";
import logoutRouter from "./api/logout";
import salariesRouter from "./api/salaries";
import signupRouter from "./api/signup";
import errorHandler from "./middleware/error-handler";
import {
    corsOptions,
    DEV_MONGO_URI,
    PORT,
    sessionOptions,
} from "./utils/config";

const app = express();

if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    if (sessionOptions.cookie) {
        sessionOptions.cookie.sameSite = "none";
        sessionOptions.cookie.secure = true;
    }
}

mongoose
    .connect(DEV_MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true, //suppress warning messages
    } as ConnectOptions)
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((error) => console.log(`Error: ${error.message}`));

// MIDDLEWARE
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session(sessionOptions));

// ROUTES
app.use("/api/auth/login", loginRouter);
app.use("/api/salaries", salariesRouter);
app.use("/api/signup", signupRouter);
app.use("/api/contributors", contributorRouter);
app.use("/api/auth/logout", logoutRouter);

// ERROR HANDLER
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

module.exports = app;
