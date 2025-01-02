const express = require("express");
const router = express.Router();
const handleAsync = require("../utils/handleAsync");
const { isLoggedIn, validateCampground, isCampAuthor } = require("../middlewares");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  // Get all campgrounds
  .get(handleAsync(campgrounds.index))
  // Create a new campground
  .post(isLoggedIn, upload.array("image"), validateCampground, handleAsync(campgrounds.create));

// New campground page
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  // Get a campground
  .get(handleAsync(campgrounds.renderShowPage))
  // Update a campground
  .put(
    isLoggedIn,
    isCampAuthor,
    upload.array("image"),
    validateCampground,
    handleAsync(campgrounds.update)
  )
  // Delete a campground
  .delete(isLoggedIn, isCampAuthor, handleAsync(campgrounds.delete));

// Campground edit page
router.get("/:id/edit", isLoggedIn, isCampAuthor, handleAsync(campgrounds.renderEditForm));

module.exports = router;
