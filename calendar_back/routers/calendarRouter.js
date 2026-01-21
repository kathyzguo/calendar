const express = require("express");
const router = express.Router();
const {getCalendars, getCalendar, createCalendar, editCalendar, deleteCalendar, createEvent, editEvent, deleteEvent} = require("../controllers/calendarController");

router.use(express.json());

router.post("/getCalendars", async (req, res) => {
    const {user_id} = req.body;
    const calendars = await getCalendars(user_id);
    res.json(calendars);
});

router.post("/getCalendar", async (req, res) => {
    const {calendar_id} = req.body;
    const calendar = await getCalendar(calendar_id);
    res.json(calendar);
});

router.post("/createCalendar", async (req, res) => {
    const {user_id, name, description, is_default} = req.body;
    const calendarCreate = await createCalendar(user_id, name, description, is_default);
    res.json(calendarCreate);
});

router.post("/editCalendar", async (req, res) => {
    const {calendar_id, name, description} = req.body;
    const calendarEdit = await editCalendar(calendar_id, name, description);
    res.json(calendarEdit);
});

router.post("/deleteCalendar", async (req, res) => {
    const {calendar_id} = req.body;
    const calendarDelete = await deleteCalendar(calendar_id);
    res.json(calendarDelete);
});

router.post("/createEvent", async (req, res) => {
    const {calendar_id, name, description, start_time, end_time, all_day, recurrence, 
        recurrence_start, recurrence_end} = req.body;
    const eventCreate = await createEvent(calendar_id, name, description, start_time, end_time, all_day, 
        recurrence, recurrence_start, recurrence_end);
    res.json(eventCreate);
});

router.post("/editEvent", async (req, res) => {
    const {event_id, calendar_id, name, description, start_time, end_time, all_day, recurrence, 
        recurrence_start, recurrence_end} = req.body;
    const eventEdit = await editEvent(event_id, calendar_id, name, description, start_time, end_time, all_day, 
        recurrence, recurrence_start, recurrence_end);
    res.json(eventEdit);
});

router.post("/deleteEvent", async (req, res) => {
    const {event_id} = req.body;
    const eventDelete = await deleteEvent(event_id);
    res.json(eventDelete);
});

module.exports = router;