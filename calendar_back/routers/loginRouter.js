const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {userAuth} = require("../middlewares/loginMiddleware");
const {addUser, checkUsers} = require("../controllers/loginController");

router.use(express.json());
router.use(cookieParser());
router.use(userAuth);

router.post("/", async (req, res) => {
    const {email, password, stay} = req.body;
    const verification = await checkUsers(email, password);
    if (verification.status && stay) {
            const jwt_token = jwt.sign(
                {id: verification.id, email: email},
                process.env.JWT_S,
                {expiresIn: stay ? "30d" : "24h"});
            const cookieOptions = {
                httpOnly: true,
                secure: (process.env.NODE_ENV === "production"),
                sameSite: "strict",
                ...(stay && {maxAge: 1000 * 60 * 60 * 24 * 30})}
            res.cookie("authToken", jwt_token, cookieOptions);
        }
    res.json(verification);
    })

router.post("/create", async (req, res) => {
    const {name, email, password} = req.body;
    const createdUser = await addUser(name, email, password);
    res.json(createdUser);
})

router.get("/authToken", (req, res) => {
    res.status(401).json({message: "No Token Provided"});
})

module.exports = router;
