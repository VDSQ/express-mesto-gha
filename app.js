/* eslint-disable import/no-unresolved */
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");
const { cors } = require("cors");
const router = require("./routes");
const errorHandler = require("./utils/errorHandler");

const { PORT = 3000, MONGO_DB = "mongodb://127.0.0.1/mestodb" } = process.env;

const app = express();

async function main() {
  mongoose.set("strictQuery", false);
  await mongoose.connect(MONGO_DB);

  app.use(
    cors({
      origin: ["https://mesto-example.nomoredomains.monster/sign-in"],
      allowedHeaders: ["Content-Type", "Authorization"],
      preflightContinue: false,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use(router);
  app.use(errors());
  app.use(errorHandler);
  app.listen(PORT);
}

// eslint-disable-next-line no-console
main().catch((error) => console.log(error));
