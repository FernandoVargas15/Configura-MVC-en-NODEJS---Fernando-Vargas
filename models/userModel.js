const mysql = require('mysql2');
require('dotenv').config();

// Crear conexión con las variables de entorno (.env)
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'Alumnos',
  port: Number(process.env.DB_PORT || 3306),
});

// Probar conexión al iniciar
db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar con MySQL:', err.message);
  } else {
    console.log('✅ Conectado a MySQL correctamente');
  }
});

module.exports = {

  findUser: (username, password, callback) => {
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0] || null);
    });
  },

  connection: db,
};
