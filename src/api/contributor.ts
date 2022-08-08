import express from "express";
import Contributor from "../models/contributor-model";
import { contributorParser } from "../parsers";
import { AppError } from "../utils/classes/AppError";

const contributorRouter = express.Router();

//VERIFY IF USER LOGGING IN HAS CONTRIBUTED//
contributorRouter.post("/", async (req, res, next) => {
  const loggedInUserUsername = req.body.username;
  const contributed = await Contributor.findOne({
    username: loggedInUserUsername,
  });
  if (!contributed) {
    return next(
      new AppError(
        "Please contribute a salary to gain access to the salary data. You will be redirected now...",
        403
      )
    );
  }
  res.status(200).json(contributed);
});

//ADD A NEW USER AS CONTRIBUTOR WHEN THEY SUBMIT A SALARY ENTRY//
contributorRouter.post("/add", async (req, res, next) => {
  const result = contributorParser(req.body.username, next);
  if (result) {
    const alreadyContributed = await Contributor.findOne({ username: result });
    if (alreadyContributed) {
      console.log("Already contributed");
      return;
    }
    try {
      const newContributor = new Contributor({ username: result });
      await newContributor.save();
      res.status(200).json(newContributor);
    } catch (error) {
      next(
        new AppError(
          "Failed to complete salary submission process, please try again later.",
          500
        )
      );
    }
  }
});

export default contributorRouter;
