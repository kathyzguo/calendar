const pool = require("./db");

async function getGoalCat(id) {
    try {
        const result = await pool.query("SELECT * FROM goals WHERE user_id = $1", [id]);
        const goals = result.rows;
        if (goals) {
            return {status: true, goals: goals};
        }
        else return {status: false};
    }
    catch (err) {
        console.error("Error:", err);
    }
}

async function getGoalDesc(id) {
    try {
        const result = await pool.query("SELECT * FROM goal_details WHERE goal_id = $1", [id]);
        const goal_details = result.rows;
        if (goal_details) {
            return {status: true, goal_details: goal_details};
        }
        else return {status: false};
    }
    catch (err) {
        console.error("Error:", err);
    }
}

async function createGoalCat(user_id, name, description) {
    try {
        const result = await pool.query("SELECT 1 FROM goals WHERE user_id = $1 AND name = $2", [user_id, name]);
        if (result && result.rowCount > 0) {
            return {status: false, message: "Goal category already exists"};
        }
        else {
            const create = await pool.query(`INSERT INTO goals (user_id, name, description) 
            VALUES ($1, $2, $3) RETURNING id`, [user_id, name, description]);
            return {status: true, message: "Goal category successfully created", goal_id: create.rows[0].id};
        }
    }
    catch (err) {
        console.error("Error:", err);
    }
}

async function editGoalCat(goal_id, name, description) {
    try {
        const edit = await pool.query(`UPDATE goals SET name = $1, description = $2 WHERE id = $3`, 
        [name, description, goal_id]);
        return {status: true, message: "Goal category successfully edited"};
    }
    catch (err) {
        console.error("Error:", err);
    }
}

async function deleteGoalCat(goal_id) {
    try {
        const dele = await pool.query(`DELETE FROM goals WHERE id = $1`, [goal_id]);
        return {status: true, message: "Goal category successfully deleted"};
    }
    catch (err) {
        console.error("Error:", err);
    }
}

async function createGoalDesc(goal_id, name, description) {
    try {
        const result = await pool.query(`SELECT 1 FROM goal_details WHERE goal_id = $1 AND name = $2
            AND description = $3`, [goal_id, name, description]);
        if (result && result.rowCount > 0) {
            return {status: false, message: "A similar goal already exists"};
        }
        else {
            const create = await pool.query(`INSERT INTO goal_details (goal_id, name, description, completed) 
            VALUES ($1, $2, $3, $4) RETURNING id`, [goal_id, name, description, false]);
            return {status: true, message: "Goal successfully created", goalD_id: create.rows[0].id};
        }
    }
    catch (err) {
        console.error("Error:", err);
    }
}

async function editGoalDesc(goalD_id, name, description, completed) {
    try {
        const edit = await pool.query(`UPDATE goal_details SET name = $2, description = $3, completed = $4 WHERE id = $1`, 
        [goalD_id, name, description, completed]);
        return {status: true, message: "Goal successfully edited"};
    }
    catch (err) {
        console.error("Error:", err);
    }
}

async function deleteGoalDesc(goalD_id) {
    try {
        const dele = await pool.query(`DELETE FROM goal_details WHERE id = $1`, [goalD_id]);
        return {status: true, message: "Goal successfully deleted"};
    }
    catch (err) {
        console.error("Error:", err);
    }
}

module.exports = {getGoalCat, getGoalDesc, createGoalCat, editGoalCat, deleteGoalCat, createGoalDesc, editGoalDesc, deleteGoalDesc};