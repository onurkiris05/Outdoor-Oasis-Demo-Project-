const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const handleAsync = require("../utils/handleAsync");
const { isLoggedIn, validateCampground, isCampAuthor } = require("../middlewares");

// Campgrounds index page
router.get(
  "/",
  handleAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// New campground page
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// Campground show page
router.get(
  "/:id",
  handleAsync(async (req, res) => {
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
  })
);

// Campground edit page
router.get(
  "/:id/edit",
  isLoggedIn,
  isCampAuthor,
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
  isLoggedIn,
  validateCampground,
  handleAsync(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);

// Update a campground
router.put(
  "/:id",
  isLoggedIn,
  isCampAuthor,
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
  isLoggedIn,
  isCampAuthor,
  handleAsync(async (req, res) => {
    const { id } = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground successfully deleted!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
