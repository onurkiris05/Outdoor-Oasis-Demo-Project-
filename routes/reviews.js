const express = require("express");

// mergeParams must be set to true to access params from the parent router
// In this case, we need access to the campground 'id' parameter defined in app.js
// Without mergeParams, req.params.id would be undefined in our routes
const router = express.Router({ mergeParams: true });

const { reviewSchema } = require("../schemas");
const Review = require("../models/review");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const handleAsync = require("../utils/handleAsync");

// Validate review data
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Create a new review
router.post(
  "/",
  validateReview,
  handleAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    req.flash("success", "Review successfully added!");
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

// Delete a review
router.delete(
  "/:reviewId",
  handleAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review successfully deleted!");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
