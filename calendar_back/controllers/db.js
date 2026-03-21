const {Pool} = require("pg"); 
    
const pool = new Pool({
    connectionString: process.env.DBURL, 
    ssl: {rejectUnauthorized: false}
});

module.exports = pool;