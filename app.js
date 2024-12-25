const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const app = express();
const PORT = process.env.PORT || 8080;
const Campground = require("./models/campground");
const ExpressError = require("./utils/ExpressError");
const handleAsync = require("./utils/handleAsync");
const { campgroundSchema } = require("./schemas");

mongoose
  .connect("mongodb://127.0.0.1:27017/outdoor-oasis")
  .then(() => {
    console.log("Mongo connection opened!");
  })
  .catch((err) => {
    console.error("Mongo connection failed!", err);
  });

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/campgrounds",
  handleAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.get(
  "/campgrounds/:id",
  handleAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("campgrounds/show", { camp });
  })
);

app.get(
  "/campgrounds/:id/edit",
  handleAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("campgrounds/edit", { camp });
  })
);

app.post(
  "/campgrounds",
  validateCampground,
  handleAsync(async (req, res, next) => {
    if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);

app.put(
  "/campgrounds/:id",
  validateCampground,
  handleAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  handleAsync(async (req, res) => {
    const { id } = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
