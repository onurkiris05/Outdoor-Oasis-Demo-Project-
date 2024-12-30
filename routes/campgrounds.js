const express = require("express");
const router = express.Router();
const { campgroundSchema } = require("../schemas");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const handleAsync = require("../utils/handleAsync");

// Validate campground data
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((e) => e.message).join(",");
    throw new ExpressError(errorMessage, 400);
  } else {
    next();
  }
};

// Campgrounds index page
router.get(
  "/",
  handleAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// New campground page
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

// Campground show page
router.get(
  "/:id",
  handleAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate("reviews");
    if (!camp) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { camp });
  })
);

// Campground edit page
router.get(
  "/:id/edit",
  handleAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { camp });
  })
);

// Create a new campground
router.post(
  "/",
  validateCampground,
  handleAsync(async (req, res, next) => {
    if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);

// Update a campground
router.put(
  "/:id",
  validateCampground,
  handleAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success", "Campground successfully edited!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Delete a campground
router.delete(
  "/:id",
  handleAsync(async (req, res) => {
    const { id } = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground successfully deleted!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
