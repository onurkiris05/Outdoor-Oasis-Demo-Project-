const express = require("express");
const router = express.Router();
const User = require("../models/user");
const handleAsync = require("../utils/handleAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middlewares");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  handleAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Outdoor Oasis!");
        res.redirect("/");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.returnTo || "/campgrounds";

    // Check if the redirectUrl contains a query string with a _method key
    if (redirectUrl.includes("_method")) {
      console.log(`Redirecting with POST method to: ${redirectUrl}`);
      res.redirect(307, redirectUrl);
    } else {
      res.redirect(redirectUrl);
    }
  }
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
