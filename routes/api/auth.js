const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const validUser = [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
];

// @route   GET api/auth POST api/auth
// @desc    Test route
// @access  Public (private route needs a token)
//validating a user
router
    .route("/")
    .get(auth, async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select("-password");
            res.json(user);
        } catch (err) {
            console.err(err.message);
            res.status(500).send("Server Error");
        }
    })
    .post(validUser, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //400 means a bad request
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // see if user exists
            let user = await User.findOne({ email });

            if (!user) {
                //bad request
                return res.status(400).json({
                    errors: [{ msg: "Invalid Credentials" }],
                });
            }

            //make sure the password matches
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                //bad request
                return res.status(400).json({
                    errors: [{ msg: "Invalid Credentials" }],
                });
            }

            // return jsonwebtoken
            // create our payload
            const payload = {
                user: {
                    id: user.id,
                },
            };
            jwt.sign(
                payload,
                config.get("JWT_TOKEN"),
                {
                    expiresIn: 360000,
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (error) {
            console.error(error.message);
            //500 => server error
            return res.status(500).send("Server error");
        }
    });

module.exports = router;
