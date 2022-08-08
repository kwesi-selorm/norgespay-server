import express from "express";
const app = express();
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";
//Database urls from Mongo Atlas imported from .env
import "dotenv/config"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo"; //create store for storing sessions in database

import { corsOptions, MONGO_URI } from "./src/utils/config";
import salaryRouter from "./src/api/salary";
import loginRouter from "./src/api/login";
import { PORT } from "./src/utils/config";
import signupRouter from "./src/api/signup";
import contributorRouter from "./src/api/contributor";

// Set up database connection. The mongoose options help to avoid errors. The monogoose connection returns a promise hence .then and .catch are used to handle errors.
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true, //suppress warning messages
  } as ConnectOptions)
  .then(() => {
    console.log("Connected to database.");
  })
  .catch((error) => console.log(`Error: ${error.message}`));

//MIDDLEWARES
app.use(cors(corsOptions)); //CORS: Cross-origin Resource Sharing
app.use(morgan("dev")); //log all requests to the console for easy tracking
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*Create session store here. Use redis and add store property to the sessionOptions object
Express session. For production use a secure session store, E.g. Redis, MongoDB*/
const sessionOptions = {
  secret: process.env.SESSION_SECRET as string,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    collectionName: "sessions",
  }),
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }, //Equals 1 day (24hrs*60min*60s*1000ms)
};
app.use(session(sessionOptions)); //Ensure persistent user login

//Routes. Inserted after all other middleware except the error handlers
app.use("/api/login", loginRouter);
app.use("/api/salaries", salaryRouter);
app.use("/api/signup", signupRouter);
app.use("/api/contributor", contributorRouter);

//Error handler. To be improved
app.use(
  (
    err: { message: string; status: number },
    _req: any,
    res: any,
    _next: any
  ) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).json({ message });
  }
);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
