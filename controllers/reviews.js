const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.create = async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  camp.reviews.push(review);
  await camp.save();
  await review.save();
  req.flash("success", "Review successfully added!");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.delete = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review successfully deleted!");
  res.redirect(`/campgrounds/${id}`);
};
