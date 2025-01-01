const express = require("express");

// mergeParams must be set to true to access params from the parent router
// In this case, we need access to the campground 'id' parameter defined in app.js
// Without mergeParams, req.params.id would be undefined in our routes
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const Campground = require("../models/campground");
const handleAsync = require("../utils/handleAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middlewares");

// Create a new review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  handleAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
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
  isLoggedIn,
  isReviewAuthor,
  handleAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review successfully deleted!");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
