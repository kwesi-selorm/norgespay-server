import mongoose, { Schema } from "mongoose";

const contributorSchema = new Schema({
  username: String,
});

contributorSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Contributor = mongoose.model(
  "Contributor",
  contributorSchema,
  "contributors"
);
export default Contributor;
