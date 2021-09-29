const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

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
    .post(validUser, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //400 means a bad request
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            // see if user exists
            let user = await User.findOne({ email });

            if (user) {
                //bad request
                return res.status(400).json({
                    errors: [{ msg: "User already exists" }],
                });
            }
            //get users gravatar
            const avatar = gravatar.url(email, {
                s: "200", //size
                r: "pg", //restrict
                d: "mm",
            });

            user = new User({ name, email, avatar, password });
            //encrypt password using bcrypt
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

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
