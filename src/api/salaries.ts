import express from "express";
import mongoose from "mongoose";
import verifyCookies from "../middleware/verify-cookies";
import Salary from "../models/salary-model";
import User from "../models/user-model";
import { idParser, newSalaryParser, updateSalaryParser } from "../parsers";
import { AppError } from "../utils/error-classes";

const salariesRouter = express.Router();

salariesRouter.use(verifyCookies);

//GET ALL SALARIES//
salariesRouter.get(
    "/all",
    async (_req: express.Request, res: express.Response, next) => {
        try {
            const salaries = await Salary.find({});
            res.status(200).json(salaries);
        } catch (error) {
            if (error instanceof Error) next(new AppError(error.message, 404));
        }
    },
);

//UPDATE SELECTED SALARY//
/* 
This is a route handler for updating a salary. It is using the `updateSalaryParser` function to
parse the request body and return an object with the `id`, `updatedSalaryAmount` and `userId`
properties. It then uses the `id` property to find the salary in the database. If the salary exists,
it checks if the `updatedSalaryAmount` is already in the `previousSalaries` array. If it is, it
returns an error. If it is not, it checks if the `userId` matches the `userId` of the salary. If it
does not, it returns an error. If it does, it updates the salary with the `updatedSalaryAmount` and
adds it to the `previousSalaries` array. 
*/
salariesRouter.put("/:id", async (req, res, next) => {
    const result = updateSalaryParser(req, next);
    if (result) {
        const { id, updatedSalaryAmount, userId } = result;

        const existingSalary = await Salary.findById({ _id: id });
        const populatedExistingSalary = await existingSalary?.populate("user");
        if (existingSalary) {
            if (existingSalary.previousSalaries.includes(updatedSalaryAmount))
                return next(
                    new AppError(
                        "Update not processed. The submitted salary already exists in the database",
                        400,
                    ),
                );

            const authorizedUserId =
                populatedExistingSalary?.user?._id.toString() as string;
            if (authorizedUserId !== userId)
                return next(
                    new AppError(
                        "Unauthorized to update salary; users may only update salaries that they have added",
                        401,
                    ),
                );

            try {
                const updates = {
                    salary: updatedSalaryAmount,
                    previousSalaries:
                        existingSalary.previousSalaries.concat(
                            updatedSalaryAmount,
                        ),
                    updatedAt: new Date(),
                };

                await Salary.findOneAndUpdate({ _id: id }, updates, {
                    new: true,
                    timestamps: false,
                });
                return res.sendStatus(200); //status: OK
            } catch (error: unknown) {
                if (error instanceof Error)
                    return next(new AppError(error.message, 400));
            }
        }
        next(new AppError("Salary not found", 404));
    }
    next();
});

//ADD SALARY//
salariesRouter.post("/", async (req, res, next) => {
    const result = newSalaryParser(req, next);
    if (result) {
        const { jobTitle, company, city, salary, sector, experience, userId } =
            result;
        const existingSalary = await Salary.findOne({
            jobTitle: jobTitle,
            company: company,
            city: city,
            sector: sector,
            experience: experience,
        });

        //DOES NOT EXIST
        if (!existingSalary) {
            const user = await User.findById({ _id: userId });
            if (!user) {
                return next(new AppError("User does not exist", 404));
            }
            const newSalary = new Salary({
                city: city,
                company: company,
                experience: experience,
                jobTitle: jobTitle,
                previousSalaries: [salary],
                salary: salary,
                sector: sector,
                user: user?._id,
            });
            try {
                await newSalary.save();
                return res.status(200).json(newSalary); //status: Created
            } catch (error) {
                if (error instanceof Error)
                    next(new AppError(error.message, 400));
            }
        }

        // SALARY ENTRY EXISTS WITH THE SAME SALARY AMOUNT FOR THE GIVEN EXPERIENCE
        if (
            existingSalary &&
            existingSalary.previousSalaries.includes(salary)
        ) {
            next(
                new AppError(
                    "Sorry, the provided salary entry already exists",
                    401,
                ),
            );
        }

        // SALARY ENTRY EXISTS BUT WITHOUT THE SUBMITTED SALARY AMOUNT
        if (
            existingSalary &&
            !existingSalary.previousSalaries.includes(salary)
        ) {
            const updatedPreviousSalaries =
                existingSalary.previousSalaries.concat(salary);
            try {
                await Salary.findOneAndUpdate(
                    { _id: existingSalary._id },
                    {
                        salary: salary,
                        previousSalaries: updatedPreviousSalaries,
                        updatedAt: new Date().toLocaleString(),
                    },
                    { new: true, timestamps: false },
                );
                return res.status(201).json({ success: "Salary updated" });
            } catch (error) {
                if (error instanceof Error)
                    next(new AppError(error.message, 400));
            }
        }
    }
});

// FIND SINGLE SALARY//
salariesRouter.get("/:id", async (req, res, next) => {
    const result = idParser(req.params.id, next);
    if (result) {
        const _id = result;
        try {
            const requestedSalary = await Salary.findById(_id);
            if (!requestedSalary)
                return next(new AppError("Resource not found", 404));
            res.status(200).json(requestedSalary);
        } catch (error) {
            if (error instanceof Error) {
                return next(new AppError("Resource not found", 404));
            }
            if (error instanceof mongoose.Error) {
                return next(new AppError(error.message, 500));
            }
        }
    }
});

export default salariesRouter;
