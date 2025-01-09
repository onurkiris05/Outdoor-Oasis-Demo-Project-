const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

// Campgrounds index page
module.exports.index = async (req, res) => {
  console.log(`CampgroundIndex route: ${req.method} ${req.url} - Request received.`);
  const campgrounds = await Campground.find({});
  console.log("CampgroundIndex route: Headers sent before res.render:", res.headersSent);
  res.render("campgrounds/index", { campgrounds });
};

// New campground page
module.exports.renderNewForm = (req, res) => {
  console.log(`CampgroundNewForm route: ${req.method} ${req.url} - Request received.`);
  console.log("CampgroundNewForm route: Headers sent before res.render:", res.headersSent);
  res.render("campgrounds/new");
};

// Campground show page
module.exports.renderShowPage = async (req, res) => {
  console.log(`CampgroundShowPage route: ${req.method} ${req.url} - Request received.`);
  const { id } = req.params;
  const camp = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!camp) {
    req.flash("error", "Cannot find that campground!");
    console.log("CampgroundShowPage route: Headers sent before res.redirect:", res.headersSent);
    return res.redirect("/campgrounds");
  }
  console.log("CampgroundShowPage route: Headers sent before res.render:", res.headersSent);
  res.render("campgrounds/show", { camp });
};

// Campground edit page
module.exports.renderEditForm = async (req, res) => {
  console.log(`CampgroundEditForm route: ${req.method} ${req.url} - Request received.`);
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp) {
    req.flash("error", "Cannot find that campground!");
    console.log("CampgroundEditForm route: Headers sent before res.redirect:", res.headersSent);
    return res.redirect("/campgrounds");
  }
  console.log("CampgroundEditForm route: Headers sent before res.render:", res.headersSent);
  res.render("campgrounds/edit", { camp });
};

// Create a new campground
module.exports.create = async (req, res, next) => {
  console.log(`CampgroundCreate route: ${req.method} ${req.url} - Request received.`);
  const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, {
    limit: 1,
  });
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.features[0].geometry;
  campground.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Successfully made a new campground!");
  console.log("CampgroundCreate route: Headers sent before res.redirect:", res.headersSent);
  res.redirect(`/campgrounds/${campground._id}`);
};

// Update a campground
module.exports.update = async (req, res) => {
  console.log(`CampgroundUpdate route: ${req.method} ${req.url} - Request received.`);
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  // Update the campground's location
  const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, {
    limit: 1,
  });
  campground.geometry = geoData.features[0].geometry;
  // Check if there are images to delete
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }
  // Check if there are new images to upload
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  await campground.save();
  req.flash("success", "Campground successfully edited!");
  console.log("CampgroundUpdate route: Headers sent before res.redirect:", res.headersSent);
  res.redirect(`/campgrounds/${campground._id}`);
};

// Delete a campground
module.exports.delete = async (req, res) => {
  console.log(`CampgroundDelete route: ${req.method} ${req.url} - Request received.`);
  const { id } = req.params;
  const deletedCamp = await Campground.findByIdAndDelete(id);
  req.flash("success", "Campground successfully deleted!");
  console.log("CampgroundDelete route: Headers sent before res.redirect:", res.headersSent);
  res.redirect("/campgrounds");
};
