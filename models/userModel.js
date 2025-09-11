// models/userModel.js

const mysql = require('mysql');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '8191', 
    database: 'db_clinica'
});ñ

db.connect();

module.exports = {
    findUser: (username, password, callback) => {
        db.query(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password],
            (err, results) => {
                if (err) throw err;
                callback(results);
            }
        );
    }
};
