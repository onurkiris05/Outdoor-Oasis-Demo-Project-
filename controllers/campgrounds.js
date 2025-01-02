const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

// Campgrounds index page
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

// New campground page
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

// Campground show page
module.exports.renderShowPage = async (req, res) => {
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
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { camp });
};

// Campground edit page
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { camp });
};

// Create a new campground
module.exports.create = async (req, res, next) => {
  const newCampground = new Campground(req.body.campground);
  newCampground.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  newCampground.author = req.user._id;
  await newCampground.save();
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${newCampground._id}`);
};

// Update a campground
module.exports.update = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
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
  res.redirect(`/campgrounds/${campground._id}`);
};

// Delete a campground
module.exports.delete = async (req, res) => {
  const { id } = req.params;
  const deletedCamp = await Campground.findByIdAndDelete(id);
  req.flash("success", "Campground successfully deleted!");
  res.redirect("/campgrounds");
};
