const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.create = async (req, res) => {
  console.log(`ReviewCreate route: ${req.method} ${req.url} - Request received.`);
  const camp = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  camp.reviews.push(review);
  await camp.save();
  await review.save();
  req.flash("success", "Review successfully added!");
  console.log("ReviewCreate route: Headers sent before res.redirect:", res.headersSent);
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.delete = async (req, res) => {
  console.log(`ReviewDelete route: ${req.method} ${req.url} - Request received.`);
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review successfully deleted!");
  console.log("ReviewDelete route: Headers sent before res.redirect:", res.headersSent);
  res.redirect(`/campgrounds/${id}`);
};
