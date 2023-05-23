require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");
const router = require("./routes");
const errorHandler = require("./utils/errorHandler");

const { PORT = 3000, MONGO_DB = "mongodb://localhost:27017/mestodb" } = process.env;

const app = express();

async function main() {
  mongoose.set("strictQuery", false);
  await mongoose.connect(MONGO_DB);

  app.use(express.json());
  app.use(cookieParser());
  app.use(router);
  app.use(errors());
  app.use(errorHandler);
  app.listen(PORT);
}

// eslint-disable-next-line no-console
main().catch((error) => console.log(error));
