import express from "express";
import Contributor from "../models/contributor-model";
import { contributorParser } from "../parsers";
import { AppError } from "../utils/error-classes";

const contributorRouter = express.Router();

//ADD A USER AS CONTRIBUTOR WHEN THEY SUBMIT A SALARY ENTRY//
contributorRouter.post("/add", async (req, res, next) => {
  const result = contributorParser(req.body.username, next);
  if (result) {
    const alreadyContributed = await Contributor.findOne({ username: result });
    if (alreadyContributed) {
      return;
    }
    try {
      const newContributor = new Contributor({ username: result });
      await newContributor.save();
      res.status(200).json(newContributor);
    } catch (error) {
      next(
        new AppError(
          "Failed to complete submission, please try again later.",
          500,
        ),
      );
    }
  }
});

export default contributorRouter;
