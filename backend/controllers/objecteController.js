import { pool } from '../utils/connectDB.js';

export async function getObjecteByNumobj(req, res) {
    const { numobj } = req.params;

    try {
        const query = 'SELECT * FROM practica.objecte WHERE numobj = $1';
        const { rows } = await pool.query(query, [numobj]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Object not found' });
        }

        const objecte = rows[0];
        res.json(objecte);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Controlador para obtener objetos disponibles para asignar a un personaje
export async function getObjecteDisponible(req, res) {
    const correu = req.userId;

    try {
        const query = `
            SELECT o.*
            FROM practica.objecte o
            LEFT JOIN practica.personatgeinvocat p ON o.numobj = p.numobj
            WHERE o.correu = $1
            AND p.numobj IS NULL
        `;
        const { rows } = await pool.query(query, [correu]);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}