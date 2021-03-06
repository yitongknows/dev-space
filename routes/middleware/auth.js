const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
    // get token from header
    const token = req.header("x-auth-token");

    //check if no token
    if (!token) {
        //401 => not authorized
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    //verify token
    try {
        const decoded = jwt.verify(token, config.get("JWT_TOKEN"));

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};
