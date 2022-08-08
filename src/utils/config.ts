import "dotenv/config";

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const SECRET = process.env.SECRET as string;

const PORT = process.env.PORT || 3001;

const MONGO_URI = process.env.MONGO_URI as string;

export { corsOptions, SECRET, PORT, MONGO_URI };
