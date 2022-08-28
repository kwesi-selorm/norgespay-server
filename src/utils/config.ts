/* eslint-disable @typescript-eslint/no-explicit-any */
import MongoDBStore from "connect-mongodb-session";
import cors from "cors";
import "dotenv/config";
import session, { SessionOptions } from "express-session";

const allowedOrigins = [
    "http://localhost:3000",
    "https://norgespay.netlify.app",
];

const corsOptions: cors.CorsOptions = {
    //   origin: function (origin, callback) {
    //     if (allowedOrigins.indexOf(origin as string) != -1 || !origin) {
    //       callback(null, true);
    //     } else {
    //       callback(new AppError("Request origin not allowed by CORS"));
    //     }
    //   },
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, // SETS ACCESS-CONTROL-ALLOW-CREDENTIALS TO TRUE
    optionsSuccessStatus: 200,
};

const PORT = process.env.PORT || 3001;
const DEV_MONGO_URI = process.env.DEV_MONGO_URI as string;
const PROD_MONGO_URI = process.env.PROD_MONGO_URI as string;

const mongoStore = MongoDBStore(session);
const store = new mongoStore({
    collection: "sessions",
    uri: DEV_MONGO_URI,
    databaseName: "dummyDatabase",
});
store.on("error", (err: any) => console.log(err));

const sessionOptions: SessionOptions = {
    secret: process.env.SESSION_SECRET as string,
    resave: true,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: false,
        maxAge: 30 * 1000, // 10s dev, 30m prod
        sameSite: "lax",
        httpOnly: true,
    },
};

export { corsOptions, PORT, DEV_MONGO_URI, PROD_MONGO_URI, sessionOptions };
