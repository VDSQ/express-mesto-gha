const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = require("./routes");

const port = 3000;
const mongoDB = "mongodb://127.0.0.1/mestodb";

const app = express();

async function main() {
  mongoose.set("strictQuery", false);
  await mongoose.connect(mongoDB);

  app.use((req, res, next) => {
    req.user = {
      _id: "64594264e3f85f85c5a66920",
    };

    next();
  });
  app.use((err, req, res, next) => {
    const { statusCode, message } = err;

    res.status(statusCode).send({
      message: statusCode === 500 ? "На сервере произошла ошибка." : message,
    });

    next();
  });
  app.use(bodyParser.json());
  app.use(router);
  app.listen(port);
}

main().catch((error) => console.log(error));
