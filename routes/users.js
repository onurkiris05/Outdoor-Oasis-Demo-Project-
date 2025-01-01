const express = require("express");
const router = express.Router();
const handleAsync = require("../utils/handleAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middlewares");
const users = require("../controllers/users");

router
  .route("/register")
  //  Render the register form
  .get(users.renderRegisterForm)
  // Register a new user
  .post(handleAsync(users.register));

router
  .route("/login")
  // Render the login form
  .get(users.renderLoginForm)
  // Login a user
  .post(
    storeReturnTo,
    passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
    users.login
  );

// Logout a user
router.get("/logout", users.logout);

module.exports = router;
