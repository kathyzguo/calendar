const bcrypt = require("bcryptjs");
const {Pool} = require("pg");
require("dotenv").config();

async function checkUsers(em, pw) {
    const pool = new Pool({
        connectionString: process.env.DBURL
    });
    try {
        const result = await pool.query("SELECT * FROM users");
        const rightUser = result.rows.find(user => user.email.toUpperCase() === em.toUpperCase());
        if (rightUser) {
            const rightPassword = await bcrypt.compare(pw, rightUser.password);
            return (rightPassword) ? {status: true, id: rightUser.id, message: "Success"} : 
            {status: false, id: rightUser.id, message: "Wrong Password"};
        }
        else {
            return {status: false, message: "Not Registered Email"};
        }
    }
    catch (err) {
        console.error("Error:", err);
    }
    pool.end();
}

async function addUser(nm, em, pw) {
    const pool = new Pool({
        connectionString: process.env.DBURL
    })
    try {
        const hashed = await bcrypt.hash(pw, 10);
        const result = await pool.query("SELECT 1 FROM users WHERE email = $1", [em]);
        if (!result.rows[0]) {
            const user = await pool.query(`INSERT INTO users (name, password, email) VALUES ($1, $2, $3)
                RETURNING id, email, password`, [nm, hashed, em]);
            return {status: true, id: user.id, message: "User Successfully Registered"}
        }
        else {
            return {message: "Email Already Registered"}
        }
    }
    catch (err) {
        console.log("Error:", err);
    }
}

module.exports = {checkUsers, addUser}