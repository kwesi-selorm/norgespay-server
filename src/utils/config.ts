import cors from "cors";
import "dotenv/config";
import { AppError } from "./classes/AppError";

const allowedOrigins = ["http://localhost:3000", "https://norgespay.netlify.app"];

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin as string) != -1 || !origin) {
      callback(null, true);
    } else {
      callback(new AppError("Request origin not allowed by CORS"));
    }
  },
  credentials: true, // SETS ACCESS-CONTROL-ALLOW-CREDENTIALS TO TRUE
  optionsSuccessStatus: 200,
};

const SECRET = process.env.SECRET as string;

const PORT = process.env.PORT || 3001;

const MONGO_URI = process.env.MONGO_URI as string;

export { corsOptions, SECRET, PORT, MONGO_URI };
