import { pool } from '../utils/connectDB.js';  // Ajusta esta ruta según tu estructura de proyecto

export async function getJugadorByEmail(req, res) {
    const { correu } = req.params;

    try {
        const query = 'SELECT * FROM practica.jugador WHERE correu = $1';
        const { rows, rowCount } = await pool.query(query, [correu]);

        if (rowCount === 0) {
            return res.status(404).json({ error: 'Jugador not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving jugador' });
    }
}

export async function updateJugador(req, res) {
    const { correu } = req.params;
    const { nom_gremi } = req.body;

    try {
        const updateData = {};
        const updates = [];

        if (nom_gremi) {
            updateData.nom_gremi = nom_gremi;
            updates.push('nom_gremi = $1');
        }

        const updateParams = Object.values(updateData);
        updateParams.push(correu);

        const query = `UPDATE practica.jugador SET ${updates.join(', ')} WHERE correu = $${updateParams.length}`;
        const { rowCount } = await pool.query(query, updateParams);

        if (rowCount === 0) {
            return res.status(404).json({ error: 'Jugador not found' });
        }

        res.json({ message: 'Jugador updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating jugador' });
    }
}

// controllers/jugadorController.js
export async function postJugador(req, res) {
    const { correu, contrasenya, nom_gremi } = req.body;

    // Verificación de los datos recibidos
    console.log('Received data:', { correu, contrasenya, nom_gremi });

    try {
        const query = 'INSERT INTO practica.jugador (correu, contrasenya, nom_gremi) VALUES ($1, $2, $3) RETURNING *';
        const { rows } = await pool.query(query, [correu, contrasenya, nom_gremi || null]);

        res.status(201).json({ message: 'Jugador registered successfully', jugador: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export async function deleteJugador(req, res) {
    const { correu } = req.params;

    try {
        const query = 'DELETE FROM practica.jugador WHERE correu = $1';
        const { rowCount } = await pool.query(query, [correu]);

        if (rowCount === 0) {
            return res.status(404).json({ error: 'Jugador not found' });
        }

        res.json({ message: 'Jugador deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting jugador' });
    }
}

export async function updateJugadorGremi(req, res) {
    const correu = req.params.correu;
    const { nom_gremi } = req.body;

    try {
        const query = 'UPDATE practica.jugador SET nom_gremi = $1 WHERE correu = $2 RETURNING *';
        const { rows } = await pool.query(query, [nom_gremi, correu]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Jugador not found' });
        }

        res.json({ message: 'Jugador gremi updated successfully', jugador: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function getCurrentJugador(req, res) {
    const correu = req.correu;

    try {
        const query = 'SELECT * FROM practica.jugador WHERE correu = $1';
        const { rows, rowCount } = await pool.query(query, [correu]);

        if (rowCount === 0) {
            return res.status(404).json({ error: 'Jugador not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
