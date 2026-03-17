const pool = require("./db");

async function getName(id) {
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        const rightUser = result.rows[0];
        return (rightUser) ? {status: true, id: rightUser.id, name: rightUser.name} : 
        {status: false, id: -1};
    }
    catch (err) {
        console.error("Error:", err);
    }
}

async function getInfo(id) {
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        const rightUser = result.rows[0];
        return (rightUser) ? {status: true, ...rightUser} : 
        {status: false, id: -1};
    }
    catch (err) {
        console.error("Error:", err);
    }
}

async function deleteUser(id) {
    try {
        const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
        if (result) return true; else false;
    }
    catch (err) {
        console.error("Error:", err);
    }
}

module.exports = {getName, getInfo, deleteUser}