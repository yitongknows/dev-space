const express = require("express");
const router = express.Router();

// @route   GET api/users
// @desc    Test route
// @access  Public (private route needs a token)
router.get("/", (req, res) => {
    res.send("User Route");
});

module.exports = router;
