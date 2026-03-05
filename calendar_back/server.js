require("dotenv").config();
const express = require("express");
const cors = require("cors");
const loginRouter = require("./routers/loginRouter");
const mainRouter = require("./routers/mainRouter");
const calendarRouter = require("./routers/calendarRouter");
const goalRouter = require("./routers/goalRouter");

const server = express();

server.use(cors({
    origin: process.env.NODE_ENV === "production"
        ? "https://yourapp.vercel.app" : "http://localhost:5173",
    credentials: true
}));
server.use("/api/login", loginRouter);
server.use("/api/main", mainRouter)
server.use("/api/calendar", calendarRouter);
server.use("/api/goal", goalRouter)

server.listen(3000, () => {
    console.log("Server started!");
});