const mongoose = require("mongoose");

// const dbURL = "mongodb://127.0.0.1:27017/outdoor-oasis"; // Local database URL
const dbURL = process.env.DB_URL; // Cloud database URL

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Mongo connection opened!");
  })
  .catch((err) => {
    console.error("Mongo connection failed!", err);
  });

module.exports = mongoose;
