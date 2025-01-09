if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const mongoSanitize = require("express-mongo-sanitize");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 8080;

// Database connection
const dbURL = process.env.DB_URL || "mongodb://127.0.0.1:27017/outdoor-oasis";

mongoose
  .connect(dbURL)
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
app.use(mongoSanitize());
app.use(require("./middleware/helmet"));

// Session configuration
const secret = process.env.SECRET || "thisshouldbeabettersecret!";
const store = MongoStore.create({
  mongoUrl: dbURL,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: secret,
  },
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
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
  console.log(`Middleware(res.locals): ${req.method} ${req.url} - Request received.`);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  console.log("Middleware(res.locals): Headers sent before next() call:", res.headersSent);
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
  console.log(`Middleware(err-500): ${req.method} ${req.url} - Request received.`);
  console.error("Error occurred:", err.message);
  console.error("Stack trace:", err.stack);
  if (res.headersSent) {
    return next(err);
  }
  console.log("Middleware(err-500): Headers sent before res.status:", res.headersSent);
  res.status(err.statusCode || 500).render("error", { err });
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
