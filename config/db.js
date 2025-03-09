const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    connectionLimit:100_000,
    waitForConnections: true,  // Várakozás a felszabaduló kapcsolatokra
    queueLimit: 0,  // Ne korlátozzuk a várakozó kapcsolatokat
    connectTimeout: 20_000, 
    timezone: process.env.DB_TZ,
    dateStrings: true,
});

module.exports = { pool };