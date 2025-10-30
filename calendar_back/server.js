const express = require("express");
const cors = require("cors");
const loginRouter = require("./routers/loginRouter");
require("dotenv").config();

const server = express();

server.use(cors({
    origin: process.env.NODE_ENV === "production"
        ? "https://yourapp.vercel.app" : "http://localhost:5173",
    credentials: true
}));
server.use("/api/login", loginRouter);

server.listen(3000, () => {
    console.log("Server started!");
});