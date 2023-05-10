/* eslint-disable import/no-unresolved */
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");
const router = require("./routes");
const errorHandler = require("./utils/errorHandler");

const port = 3000;
const mongoDB = "mongodb://127.0.0.1/mestodb";

const app = express();

async function main() {
  mongoose.set("strictQuery", false);
  await mongoose.connect(mongoDB);

  app.use(express.json());
  app.use(cookieParser());
  app.use(router);
  app.use(errors());
  app.use(errorHandler);
  app.listen(port);
}

main().catch((error) => console.log(error));
