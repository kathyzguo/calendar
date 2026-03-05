const pool = require("./db");

async function getCalendars(id) {
    try {
        const result = await pool.query("SELECT * FROM calendars WHERE user_id = $1", [id]);
        const calendars = result.rows;
        if (calendars) {
            return {status: true, calendars: calendars};
        }
        else return {status: false};
    }
    catch (err) {
        console.error("Error:", err);
    }
}

async function getCalendar(id) {
    try {
        const result = await pool.query("SELECT * FROM calendar_events WHERE calendar_id = $1", [id]);
        const calendar_events = result.rows;
        if (calendar_events) {
            return {status: true, events: calendar_events};
        }
        else return {status: false};
    }
    catch (err) {
        console.error("Error:", err);
    }
}

async function createCalendar(user_id, name, description, is_default) {
    try {
        const result = await pool.query("SELECT 1 FROM calendars WHERE user_id = $1 AND name = $2", [user_id, name]);
        if (result && result.rowCount > 0) {
            return {status: false, message: "Calendar already exists"};
        }
        else {
            const create = await pool.query(`INSERT INTO calendars (user_id, name, description, is_default) 
            VALUES ($1, $2, $3, $4) RETURNING id`, [user_id, name, description, is_default]);
            return {status: true, message: "Calendar successfully created", calendar_id: create.rows[0].id};
        }
    }
    catch (err) {
        console.error("Error:", err);
    }
}

async function editCalendar(calendar_id, name, description) {
    try {
        const edit = await pool.query(`UPDATE calendars SET name = $1, description = $2 WHERE id = $3`, 
        [name, description, calendar_id]);
        return {status: true, message: "Calendar successfully edited"};
    }
    catch (err) {
        console.error("Error:", err);
    }
}

async function deleteCalendar(calendar_id) {
    try {
        const dele = await pool.query(`DELETE FROM calendars WHERE id = $1`, [calendar_id]);
        return {status: true, message: "Calendar successfully deleted"};
    }
    catch (err) {
        console.error("Error:", err);
    }
}

async function createEvent(calendar_id, name, description, start_time, end_time, all_day, 
    recurrence, recurrence_start, recurrence_end) {
    try {
        const result = await pool.query(`SELECT 1 FROM calendar_events WHERE calendar_id = $1 AND name = $2
            AND description = $3 AND start_time = $4 AND all_day = $5 AND recurrence = $6`, [calendar_id, name, description,
                start_time, all_day, recurrence]);
        if (result && result.rowCount > 0) {
            return {status: false, message: "A similar event already exists"};
        }
        else {
            const create = await pool.query(`INSERT INTO calendar_events (calendar_id, name, description, start_time,
            end_time, all_day, recurrence, recurrence_start, recurrence_end) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`, [calendar_id, name, description, start_time, end_time, all_day,
                recurrence, recurrence_start, recurrence_end]);
            return {status: true, message: "Event successfully created", event_id: create.rows[0].id};
        }
    }
    catch (err) {
        console.error("Error:", err);
    }
}

async function editEvent(event_id, calendar_id, name, description, start_time, end_time, all_day, 
    recurrence, recurrence_start, recurrence_end) {
    try {
        const edit = await pool.query(`UPDATE calendar_events SET calendar_id = $1, name = $2, description = $3, start_time = $4,
        end_time = $5, all_day = $6, recurrence = $7, recurrence_start = $8, recurrence_end = $9 WHERE id = $10`, 
        [calendar_id, name, description, start_time, end_time, all_day, recurrence, recurrence_start, recurrence_end, event_id]);
        return {status: true, message: "Event successfully edited"};
    }
    catch (err) {
        console.error("Error:", err);
    }
}

async function deleteEvent(event_id) {
    try {
        const dele = await pool.query(`DELETE FROM calendar_events WHERE id = $1`, [event_id]);
        return {status: true, message: "Event successfully deleted"};
    }
    catch (err) {
        console.error("Error:", err);
    }
}

module.exports = {getCalendars, getCalendar, createCalendar, editCalendar, deleteCalendar, createEvent, editEvent, deleteEvent};