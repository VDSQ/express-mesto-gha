const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes");

const port = 3000;
const mongoDB = "mongodb://127.0.0.1/mestodb";

const app = express();

async function main() {
  mongoose.set("strictQuery", false);
  await mongoose.connect(mongoDB);

  app.use((req, res, next) => {
    req.user = {
      _id: "645a1f436690dee05572ba8a",
    };

    next();
  });
  app.use(express.json());
  app.use(router);
  app.listen(port);
}

main().catch((error) => console.log(error));
