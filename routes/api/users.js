const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// @route   GET api/users, POST api/users
// @desc    Test route
// @access  Public (private route needs a token)

const validUser = [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
        "password",
        "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
];

router
    .route("/")
    .get((req, res) => {
        res.send("User Route");
    })
    .post(validUser, (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //400 means a bad request
            return res.status(400).json({ errors: errors.array() });
        }

        res.send("User Route");
    });
module.exports = router;
