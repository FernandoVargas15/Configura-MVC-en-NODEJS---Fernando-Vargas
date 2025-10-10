const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'Alumnos',
    port: Number(process.env.DB_PORT || 3306),
});

db.connect((err) => {
    if (err) {
        console.error('Error de conexión a MySQL:', err.message);
        process.exit(1);
    }
    console.log('Conectado a MySQL');
});


app.get('/api/alumnos', (req, res) => {
    const sql = 'SELECT * FROM Tabla_Alumnos ORDER BY id DESC';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error al obtener estudiantes',
                error: err.message,
            });
        }
        res.json(results);
    });
});


app.get('/api/alumnos/:id', (req, res) => {
    const sql = 'SELECT * FROM Tabla_Alumnos WHERE id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error al obtener estudiante',
                error: err.message,
            });
        }
        if (results.length === 0) {
            return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
        }
        res.json(results[0]);
    });
});

app.post('/api/alumnos', (req, res) => {
    let { nombre_alumno, email_alumno, curso, sexo, habla_ingles } = req.body;

    if (!nombre_alumno || !email_alumno || !curso || !sexo) {
        return res
            .status(400)
            .json({ mensaje: 'Faltan campos: nombre_alumno, email_alumno, curso, sexo' });
    }

    const sexosValidos = ['masculino', 'femenino'];
    if (!sexosValidos.includes(String(sexo).toLowerCase())) {
        return res.status(400).json({ mensaje: "sexo debe ser 'masculino' o 'femenino'" });
    }
    habla_ingles = ['1', 1, true, 'true', 'si', 'sí'].includes(habla_ingles) ? 1 : 0;

    const sql =
        'INSERT INTO Tabla_Alumnos (nombre_alumno, email_alumno, curso, sexo, habla_ingles) VALUES (?, ?, ?, ?, ?)';
    const params = [nombre_alumno, email_alumno, curso, sexo.toLowerCase(), habla_ingles];

    db.query(sql, params, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res
                    .status(400)
                    .json({ mensaje: 'El email ya está registrado (UNIQUE)' });
            }
            return res.status(500).json({
                mensaje: 'Error al crear estudiante',
                error: err.message,
            });
        }
        res.status(201).json({
            id: result.insertId,
            nombre_alumno,
            email_alumno,
            curso,
            sexo: sexo.toLowerCase(),
            habla_ingles,
        });
    });
});

app.put('/api/alumnos/:id', (req, res) => {
    let { nombre_alumno, email_alumno, curso, sexo, habla_ingles } = req.body;

    const updates = [];
    const params = [];

    if (nombre_alumno) {
        updates.push('nombre_alumno = ?');
        params.push(nombre_alumno);
    }
    if (email_alumno) {
        updates.push('email_alumno = ?');
        params.push(email_alumno);
    }
    if (curso) {
        updates.push('curso = ?');
        params.push(curso);
    }
    if (sexo) {
        const sexosValidos = ['masculino', 'femenino'];
        if (!sexosValidos.includes(String(sexo).toLowerCase())) {
            return res.status(400).json({ mensaje: "sexo debe ser 'masculino' o 'femenino'" });
        }
        updates.push('sexo = ?');
        params.push(sexo.toLowerCase());
    }
    if (typeof habla_ingles !== 'undefined') {
        const val = ['1', 1, true, 'true', 'si', 'sí'].includes(habla_ingles) ? 1 : 0;
        updates.push('habla_ingles = ?');
        params.push(val);
    }

    if (updates.length === 0) {
        return res.status(400).json({ mensaje: 'No hay campos para actualizar' });
    }

    const sql = `UPDATE Tabla_Alumnos SET ${updates.join(', ')} WHERE id = ?`;
    params.push(req.params.id);

    db.query(sql, params, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res
                    .status(400)
                    .json({ mensaje: 'El email ya está registrado (UNIQUE)' });
            }
            return res.status(500).json({
                mensaje: 'Error al actualizar estudiante',
                error: err.message,
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
        }
        res.json({ mensaje: 'Actualizado correctamente' });
    });
});

app.delete('/api/alumnos/:id', (req, res) => {
    const sql = 'DELETE FROM Tabla_Alumnos WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error al eliminar estudiante',
                error: err.message,
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
        }
        res.json({ mensaje: 'Eliminado correctamente' });
    });
});

app.listen(PORT, () => {
    console.log(`API escuchando en http://localhost:${PORT}`);
});
