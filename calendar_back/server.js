require("dotenv").config();
const express = require("express");
const cors = require("cors");
const loginRouter = require("./routers/loginRouter");
const mainRouter = require("./routers/mainRouter");
const calendarRouter = require("./routers/calendarRouter");
const goalRouter = require("./routers/goalRouter");

const server = express();
const PORT = process.env.PORT || 8080;

server.use(cors({
    origin: process.env.NODE_ENV === "production"
        ? "https://traxiu.com" : "http://localhost:5173",
    credentials: true
}));
server.use("/api/login", loginRouter);
server.use("/api/main", mainRouter)
server.use("/api/calendar", calendarRouter);
server.use("/api/goal", goalRouter)

server.get("/", (req, res) => {
  res.status(200).send("OK");
});

server.listen(PORT);