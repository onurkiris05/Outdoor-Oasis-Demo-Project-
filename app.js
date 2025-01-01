const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 8080;

// Database connection
mongoose
  .connect("mongodb://127.0.0.1:27017/outdoor-oasis")
  .then(() => {
    console.log("Mongo connection opened!");
  })
  .catch((err) => {
    console.error("Mongo connection failed!", err);
  });

// App configuration
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Session configuration
const sessionConfig = {
  secret: "3kjF9^&$fj3@9fk92jf0!smxR&f!R9n7&kJ29",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
