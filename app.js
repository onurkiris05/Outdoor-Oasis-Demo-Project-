if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const mongoSanitize = require("express-mongo-sanitize");
const checkAndSeedDB = require("./seeds");

const app = express();
const PORT = process.env.PORT || 8080;

// Database connection
require("./config/database");
checkAndSeedDB();

// App configuration
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(mongoSanitize());
app.use(require("./middleware/csp"));

// Session configuration
app.use(require("./config/session"));
app.use(flash());

// Passport configuration
const passport = require("./middleware/passport");
app.use(passport.initialize());
app.use(passport.session());

// Middleware to process user data
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// Error handling
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});

// Catch-all route for 404 errors
app.all(/(.*)/, (req, res, next) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  console.log("Session data:", req.session);
  console.log("Headers:", req.headers);
  next(new ExpressError("Page not found", 404));
});

// Start server
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
