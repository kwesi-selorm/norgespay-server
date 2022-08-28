import { NextFunction } from "express-serve-static-core";
import Joi from "joi";
import {
    AddedSalary,
    AddSalaryRequest,
    LoginRequest,
    NewUser,
    SignUpRequest,
    UpdateSalaryRequest,
} from "./types/types";
import { AppError } from "./utils/error-classes";
import {
    idSchema,
    loginSchema,
    newSalarySchema,
    signUpSchema,
    updatedSalarySchema,
    userIdSchema,
} from "./utils/joi-schemas";

/* Async function error handling: Pass error instance to next function for handling, 
else throw new Error as usual */

//ADD SALARY INPUT
export function newSalaryParser(req: AddSalaryRequest, next: NextFunction) {
    const { error, value } = newSalarySchema.validate(req.body, {
        abortEarly: false,
    }); //Ensure all fields are validated before returning the error
    if (error) {
        const errorMsgs = error.details.map((m) => m.message);
        const errorMsgsString = errorMsgs.join(", ");
        next(new AppError(errorMsgsString, 401));
        return;
    }
    const newSalary: AddedSalary = value;
    return newSalary;
}

//UPDATE SALARY INPUT//
export function updateSalaryParser(
    req: UpdateSalaryRequest,
    next: NextFunction,
) {
    const { error: idError, value: _id } = idSchema.validate(req.params.id);
    const { error: updatedSalaryError, value: updatedSalary } =
        updatedSalarySchema.validate(req.body.updatedSalary);
    const { error: userIdError, value: user } = userIdSchema.validate(
        req.body.userId,
    );

    //HANDLE VALIDATION ERRORS
    if (idError) {
        next(new AppError(idError.details[0].message, 400));
        return;
    }
    if (updatedSalaryError) {
        next(new AppError(updatedSalaryError.details[0].message, 400));
        return;
    }
    if (userIdError) {
        next(new AppError(userIdError.details[0].message, 400));
        return;
    }

    const id: string = _id;
    const updatedSalaryAmount: number = updatedSalary;
    const userId: string = user;
    return { id, updatedSalaryAmount, userId };
}

//LOGIN INPUT//
export function loginParser(req: LoginRequest, next: NextFunction) {
    const { error, value } = loginSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const errorMsgs = error.details.map((m) => m.message);
        const errorMsgsString = errorMsgs.join(", ");
        return next(new AppError(errorMsgsString, 400));
    }
    const username: string = value.username;
    const password: string = value.password;
    return { username, password };
}

//SIGNUP INPUT
export function signupParser(req: SignUpRequest, next: NextFunction) {
    const { error, value: newAccount } = signUpSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const errorMsgs = error.details.map((m) => m.message);
        const errorMsgsString = errorMsgs.join(", ");
        next(new AppError(errorMsgsString, 400));
        return;
    }
    const newUser: NewUser = newAccount;
    return newUser;
}

//SINGLE SALARY ID REQUEST
export function idParser(id: unknown, next: NextFunction) {
    const { error, value } = idSchema.validate(id);
    if (error) {
        next(new AppError(error.details[0].message, 400));
        return;
    }
    const salaryId: string = value;
    return salaryId;
}

//NEW CONTRIBUTOR
export function contributorParser(user: unknown, next: NextFunction) {
    const { error, value } = Joi.string().validate(user);
    if (error) {
        next(new AppError(error.details[0].message, 400));
        return;
    }
    const username: string = value;
    return username;
}
