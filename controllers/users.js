const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  console.log(`RegisterForm route: ${req.method} ${req.url} - Request received.`);
  console.log("RegisterForm route: Headers sent before res.render:", res.headersSent);
  res.render("users/register");
};

module.exports.renderLoginForm = (req, res) => {
  console.log(`LoginForm route: ${req.method} ${req.url} - Request received.`);
  console.log("LoginForm route: Headers sent before res.render:", res.headersSent);
  res.render("users/login");
};

module.exports.register = async (req, res, next) => {
  try {
    console.log(`Register route: ${req.method} ${req.url} - Request received.`);
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Outdoor Oasis!");
      console.log("Register route: Headers sent before res.redirect(home):", res.headersSent);
      res.redirect("/");
    });
  } catch (e) {
    req.flash("error", e.message);
    console.log("Register route: Headers sent before res.redirect(register):", res.headersSent);
    res.redirect("/register");
  }
};

module.exports.login = (req, res) => {
  console.log(`Login route: ${req.method} ${req.url} - Request received.`);
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.returnTo || "/campgrounds";

  // Check if the redirectUrl contains a query string with a _method key
  if (redirectUrl.includes("_method")) {
    console.log(`Redirecting with POST method to: ${redirectUrl}`);
    console.log("Login route: Headers sent before res.redirect(307):", res.headersSent);
    res.redirect(307, redirectUrl);
  } else {
    console.log("Login route: Headers sent before res.redirect:", res.headersSent);
    res.redirect(redirectUrl);
  }
};

module.exports.logout = (req, res, next) => {
  console.log(`Logout route: ${req.method} ${req.url} - Request received.`);
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    console.log("Logout route: Headers sent before res.redirect:", res.headersSent);
    res.redirect("/");
  });
};
