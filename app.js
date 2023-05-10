const express = require("express");
const mongoose = require("mongoose");
// eslint-disable-next-line import/no-unresolved
const cookieParser = require("cookie-parser");
const router = require("./routes");

const port = 3000;
const mongoDB = "mongodb://127.0.0.1/mestodb";

const app = express();

async function main() {
  mongoose.set("strictQuery", false);
  await mongoose.connect(mongoDB);

  app.use(express.json());
  app.use(cookieParser());
  app.use(router);
  app.listen(port);
}

main().catch((error) => console.log(error));
