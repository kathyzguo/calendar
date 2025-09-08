const jwt = require("jsonwebtoken");
require("dotenv").config();

function userAuth(req, res, next) {
    const token = req.cookies.authToken;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_S);
            res.json({status: true, id: decoded.id, message: "Success"});
        }
        catch (error) {
            res.status(401).json({message: "JSON Token Failure"});
        }
    }
    else {
        next();
    }
}

module.exports = {userAuth}