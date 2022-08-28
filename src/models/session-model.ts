import mongoose from "mongoose";
const { Schema } = mongoose;

const sessionSchema = new Schema({
    _id: String,
    expires: Date,
    session: {
        cookie: {
            originalMaxAge: Number,
            expires: Date,
        },
        secure: Boolean,
        httpOnly: Boolean,
        domain: { type: String || undefined, default: null },
        path: String,
        sameSite: Boolean,
        user: {
            username: String,
            id: String,
            contributed: Boolean,
        },
    },
});

const Session = mongoose.model("Session", sessionSchema, "sessions");

export default Session;
