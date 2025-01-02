const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose
  .connect("mongodb://127.0.0.1:27017/outdoor-oasis")
  .then(() => {
    console.log("Mongo connection opened!");
  })
  .catch((err) => {
    console.error("Mongo connection failed!", err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});

  for (const c of cities) {
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "6774e3babe7e91f84b227097",
      location: `${c.city}, ${c.state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste officia mollitia quaerat qui? Suscipit, recusandae ipsam voluptatem natus eligendi sequi similique exercitationem quod maiores voluptatum quae minima, facilis at. Similique?`,
      price,
      images: [
        {
          url: "https://res.cloudinary.com/djzahz5ym/image/upload/v1735810886/Outdoor%20Oasis/wfz65cnyiiqe371qxrtm.jpg",
          filename: "Outdoor Oasis/wfz65cnyiiqe371qxrtm",
        },
        {
          url: "https://res.cloudinary.com/djzahz5ym/image/upload/v1735810885/Outdoor%20Oasis/vziwtpc90ch3kogqvh6h.jpg",
          filename: "Outdoor Oasis/vziwtpc90ch3kogqvh6h",
        },
        {
          url: "https://res.cloudinary.com/djzahz5ym/image/upload/v1735810886/Outdoor%20Oasis/bk15xwfnpacyphqbrle6.jpg",
          filename: "Outdoor Oasis/bk15xwfnpacyphqbrle6",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
  console.log("Mongo connection closed after seeding sequence!");
});
