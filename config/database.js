const mongoose = require("mongoose");

const dbURL =
  process.env.NODE_ENV !== "production"
    ? "mongodb://127.0.0.1:27017/outdoor-oasis"
    : process.env.DB_URL;

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Mongo connection opened!");
  })
  .catch((err) => {
    console.error("Mongo connection failed!", err);
  });

module.exports = mongoose;
