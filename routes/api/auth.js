const express = require("express");
const router = express.Router();

// @route   GET api/auth
// @desc    Test route
// @access  Public (private route needs a token)
router.get("/", (req, res) => {
    res.send("Auth Route");
});

module.exports = router;
