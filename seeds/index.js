const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places, stockImages } = require("./seedHelpers");

// const adminID = "6774e3babe7e91f84b227097"; // Local admin ID
const adminID = process.env.CLOUD_ADMIN;

const getRandomImages = (images, num) => {
  const randomImages = [];
  const usedIndices = new Set();
  while (randomImages.length < num) {
    const index = Math.floor(Math.random() * images.length);
    if (!usedIndices.has(index)) {
      randomImages.push(images[index]);
      usedIndices.add(index);
    }
  }
  return randomImages;
};

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});

  for (const c of cities) {
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: adminID,
      location: `${c.city}, ${c.country}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      price,
      description: `Experience the beauty of nature at ${c.city}, ${c.country}. This place offers a serene escape from the hustle and bustle of city life. Enjoy breathtaking views, peaceful surroundings, and a variety of outdoor activities. Whether you're looking to relax or embark on an adventure, our campground is the perfect destination.`,
      images: getRandomImages(stockImages, 3),
      geometry: {
        type: "Point",
        coordinates: [c.longitude, c.latitude],
      },
    });
    await camp.save();
  }
};

const checkAndSeedDB = async () => {
  const campgroundCount = await Campground.countDocuments({});
  if (campgroundCount === 0) {
    console.log("No campgrounds found. Seeding the database...");
    await seedDB().then(() => {
      console.log("Seeding sequence completed!");
    });
  } else {
    console.log("Database already seeded. Skipping seeding process.");
  }
};

module.exports = checkAndSeedDB;
