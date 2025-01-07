const express = require("express");

// mergeParams must be set to true to access params from the parent router
// In this case, we need access to the campground 'id' parameter defined in app.js
// Without mergeParams, req.params.id would be undefined in our routes
const router = express.Router({ mergeParams: true });
const handleAsync = require("../utils/handleAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");

// Create a new review
router.post("/", isLoggedIn, validateReview, handleAsync(reviews.create));

// Delete a review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, handleAsync(reviews.delete));

module.exports = router;
