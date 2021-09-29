const express = require("express");
const router = express.Router();

// @route   GET api/profile
// @desc    Test route
// @access  Public (private route needs a token)
router.get("/", (req, res) => {
    res.send("Profile Route");
});

module.exports = router;
