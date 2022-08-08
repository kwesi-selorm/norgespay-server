import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true }, //email input
  username: { type: String, required: true, minLength: 5 },
  passwordHash: { type: String, required: true, minLength: 8 },
});

userSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

//The third argument implies saving documents based on the User schema in the users collection
const User = mongoose.model("User", userSchema, "users");

export default User;
