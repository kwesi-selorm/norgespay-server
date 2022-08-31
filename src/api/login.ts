import express from "express";
import { validatePassword } from "../fns/password-fns";
import Contributor from "../models/contributor-model";
import User from "../models/user-model";
import { loginParser } from "../parsers";
import { SessionUser } from "../types/types";
import { AppError } from "../utils/error-classes";

declare module "express-session" {
    interface SessionData {
        user: SessionUser;
    }
}

const loginRouter = express.Router();

/* 
This is a post request to the login route. It is using the loginParser function to parse the request body and return the username and password. It then uses the username to find the user in the
database. If the user is found, it uses the validatePassword function to check if the password is
correct. If the password is correct, it creates a payload with the username and id. It then creates
an access token and a refresh token. It then creates a secure cookie with the refresh token. It then
sends a response with the access token, username, and id. 
*/

loginRouter.post(
    "/",
    async (req: express.Request, res: express.Response, next) => {
        const result = loginParser(req, next);
        if (!result) return;

        const { username, password } = result;
        try {
            const user = await User.findOne({ username });
            if (user == null) return next(new AppError("User not found", 404));
            const match = await validatePassword(password, user.passwordHash);
            if (!match)
                return next(new AppError("Invalid username or password", 401));

            let contributor = false;
            const document = await Contributor.findOne({
                username,
            });
            if (document) contributor = true;

            const authUser = {
                username: user.username,
                id: user._id.toString(),
                contributed: contributor,
            };

            req.session.user = authUser;
            // console.log(req.session);
            res.json(authUser);
        } catch (error) {
            if (error instanceof Error)
                next(
                    new AppError(
                        `Login failed, please try again later: ${error.message}`,
                        500,
                    ),
                );
        }
    },
);

export default loginRouter;
