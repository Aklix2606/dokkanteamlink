import { pool } from '../utils/connectDB.js';

// Obtener miembros del gremio
export const getGuildMembers = async (req, res) => {
    const { userId } = req;
    try {
        const userQuery = 'SELECT nom_gremi FROM practica.jugador WHERE correu = $1';
        const userResult = await pool.query(userQuery, [userId]);
        const nom_gremi = userResult.rows[0]?.nom_gremi;

        if (!nom_gremi) {
            return res.status(404).json({ error: 'No pertenece a ningún gremio' });
        }

        const guildQuery = 'SELECT correu, nom_gremi FROM practica.jugador WHERE nom_gremi = $1';
        const guildMembers = await pool.query(guildQuery, [nom_gremi]);

        res.json(guildMembers.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obteniendo los miembros del gremio' });
    }
};

// Crear un nuevo gremio
export const createGuild = async (req, res) => {
    const { userId } = req;
    const { nom_gremi } = req.body;

    try {
        const userQuery = 'SELECT nom_gremi FROM practica.jugador WHERE correu = $1';
        const userResult = await pool.query(userQuery, [userId]);
        if (userResult.rows[0]?.nom_gremi) {
            return res.status(403).json({ error: 'Ya pertenece a un gremio' });
        }

        const existingGuildQuery = 'SELECT nom_gremi FROM practica.gremi WHERE nom_gremi = $1';
        const existingGuildResult = await pool.query(existingGuildQuery, [nom_gremi]);
        if (existingGuildResult.rows.length > 0) {
            return res.status(400).json({ error: 'El nombre del gremio ya está en uso' });
        }

        const createGuildQuery = 'INSERT INTO practica.gremi (nom_gremi) VALUES ($1)';
        await pool.query(createGuildQuery, [nom_gremi]);

        const updateUserQuery = 'UPDATE practica.jugador SET nom_gremi = $1 WHERE correu = $2';
        await pool.query(updateUserQuery, [nom_gremi, userId]);

        res.status(201).json({ message: 'Gremio creado y asignado al usuario' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creando el gremio' });
    }
};

// Dejar el gremio
export const leaveGuild = async (req, res) => {
    const { userId } = req;

    try {
        const userQuery = 'SELECT nom_gremi FROM practica.jugador WHERE correu = $1';
        const userResult = await pool.query(userQuery, [userId]);
        const nom_gremi = userResult.rows[0]?.nom_gremi;

        if (!nom_gremi) {
            return res.status(404).json({ error: 'No pertenece a ningún gremio' });
        }

        const updateUserQuery = 'UPDATE practica.jugador SET nom_gremi = NULL WHERE correu = $1';
        await pool.query(updateUserQuery, [userId]);

        const guildMembersQuery = 'SELECT correu FROM practica.jugador WHERE nom_gremi = $1';
        const guildMembersResult = await pool.query(guildMembersQuery, [nom_gremi]);
        if (guildMembersResult.rows.length === 0) {
            const deleteGuildQuery = 'DELETE FROM practica.gremi WHERE nom_gremi = $1';
            await pool.query(deleteGuildQuery, [nom_gremi]);
        }

        res.status(200).json({ message: 'Has dejado el gremio' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al dejar el gremio' });
    }
};

// Obtener todos los gremios
export const getAllGuilds = async (req, res) => {
    try {
        const guildsQuery = 'SELECT nom_gremi FROM practica.gremi';
        const guildsResult = await pool.query(guildsQuery);

        // Enviar los gremios como un array de objetos con la propiedad nom_gremi
        const guilds = guildsResult.rows.map(row => ({ nom_gremi: row.nom_gremi }));

        res.json(guilds);
    } catch (error) {
        console.error('Error obteniendo todos los gremios:', error);
        res.status(500).json({ error: 'Error obteniendo todos los gremios' });
    }
};

// Unirse a un gremio
export const joinGuild = async (req, res) => {
    const { userId } = req;
    const { nom_gremi } = req.body;

    try {
        const userQuery = 'SELECT nom_gremi FROM practica.jugador WHERE correu = $1';
        const userResult = await pool.query(userQuery, [userId]);
        if (userResult.rows[0]?.nom_gremi) {
            return res.status(403).json({ error: 'Ya pertenece a un gremio' });
        }

        const existingGuildQuery = 'SELECT nom_gremi FROM practica.gremi WHERE nom_gremi = $1';
        const existingGuildResult = await pool.query(existingGuildQuery, [nom_gremi]);
        if (existingGuildResult.rows.length === 0) {
            return res.status(404).json({ error: 'El gremio no existe' });
        }

        const updateUserQuery = 'UPDATE practica.jugador SET nom_gremi = $1 WHERE correu = $2';
        await pool.query(updateUserQuery, [nom_gremi, userId]);

        res.status(200).json({ message: 'Te has unido al gremio' });
    } catch (error) {
        console.error('Error uniéndose al gremio:', error);
        res.status(500).json({ error: 'Error uniéndose al gremio' });
    }
};
