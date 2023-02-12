const Pool = require('pg').Pool;
const pool = new Pool({
    user: "postgres",
    password: "yash",
    host: "localhost",
    port: 5432,
    database: "biguniv"
});

module.exports = pool;