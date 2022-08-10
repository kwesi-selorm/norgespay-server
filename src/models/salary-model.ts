import mongoose from "mongoose";
const { Schema } = mongoose;

const salarySchema = new Schema(
  {
    city: String,
    company: String,
    experience: Number,
    jobTitle: String,
    previousSalaries: [Number],
    salary: Number,
    sector: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

salarySchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    // returnedObject.createdAt = returnedObject.createdAt.toLocaleString();
    returnedObject.updatedAt = returnedObject.updatedAt.toLocaleString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Salary = mongoose.model("Salary", salarySchema, "salaries");

export default Salary;
