const Campground = require("../models/campground");
const Review = require("../models/review");
const { campgroundSchema, reviewSchema } = require("../schemas");
const ExpressError = require("../utils/ExpressError");

// Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  console.log(`IsLoggedIn route: ${req.method} ${req.url} - Request received.`);
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    console.log("IsLoggedIn route: Headers sent after NOT logged in:", res.headersSent);
    return res.redirect("/login");
  }
  console.log("IsLoggedIn route: Headers sent before next() call:", res.headersSent);
  next();
};

// Store the returnTo path in the session
module.exports.storeReturnTo = (req, res, next) => {
  console.log(`StoreReturnTo route: ${req.method} ${req.url} - Request received.`);
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  console.log("StoreReturnTo route: Headers sent before next() call:", res.headersSent);
  next();
};

// Validate campground data
module.exports.validateCampground = (req, res, next) => {
  console.log(`ValidateCampground route: ${req.method} ${req.url} - Request received.`);
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((e) => e.message).join(",");
    console.log("ValidateCampground route: Headers sent before validation error:", res.headersSent);
    throw new ExpressError(errorMessage, 400);
  } else {
    console.log("ValidateCampground route: Headers sent before next() call:", res.headersSent);
    next();
  }
};

// Check if user is the author of a campground
module.exports.isCampAuthor = async (req, res, next) => {
  console.log(`IsCampAuthor route: ${req.method} ${req.url} - Request received.`);
  const { id } = req.params;
  const foundCampground = await Campground.findById(id);
  if (!foundCampground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    console.log("IsCampAuthor route: Headers sent before res.redirect:", res.headersSent);
    return res.redirect(`/campgrounds/${id}`);
  }
  console.log("IsCampAuthor route: Headers sent before next() call:", res.headersSent);
  next();
};

// Check if user is the author of a review
module.exports.isReviewAuthor = async (req, res, next) => {
  console.log(`IsReviewAuthor route: ${req.method} ${req.url} - Request received.`);
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    console.log("IsReviewAuthor route: Headers sent before res.redirect:", res.headersSent);
    return res.redirect(`/campgrounds/${id}`);
  }
  console.log("IsReviewAuthor route: Headers sent before next() call:", res.headersSent);
  next();
};

// Validate review data
module.exports.validateReview = (req, res, next) => {
  console.log(`ValidateReview route: ${req.method} ${req.url} - Request received.`);
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    console.log("ValidateReview route: Headers sent before validation error:", res.headersSent);
    throw new ExpressError(msg, 400);
  } else {
    console.log("ValidateReview route: Headers sent before next() call:", res.headersSent);
    next();
  }
};
