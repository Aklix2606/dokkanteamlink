import { Pool } from 'pg';

const pool = new Pool({
    user: 'tu_usuario',
    password: 'tu_contraseña',
    host: 'tu_host',
    port: 5432,
    database: 'tu_basededatos',
});

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
    const { contrasenya, nom_gremi } = req.body;

    try {
        const updateData = {};
        const updates = [];

        if (contrasenya) {
            return res.status(400).json({ error: 'Changing password is not allowed' });
        }

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

export async function postJugador(req, res) {
    const { correu, contrasenya, nom_gremi } = req.body;

    try {
        const query = 'INSERT INTO practica.jugador (correu, contrasenya, nom_gremi) VALUES ($1, $2, $3) RETURNING *';
        const { rows } = await pool.query(query, [correu, contrasenya, nom_gremi]);

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

