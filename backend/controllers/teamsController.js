import { pool } from '../utils/connectDB.js';

export async function getTeams(req, res) {
  const correu = req.userId;

  try {
    const query = 'SELECT * FROM practica.equip WHERE correu = $1';
    const result = await pool.query(query, [correu]);

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching teams' });
  }
}
export async function getTeam(req, res) {
  const { nomequip } = req.params;
  const correu = req.userId;

  try {
    const query = 'SELECT * FROM practica.equip WHERE nomequip = $1 AND correu = $2';
    const result = await pool.query(query, [nomequip, correu]);

    if (result.rows.length > 0) {
      return res.json(result.rows[0]);
    } else {
      return res.status(404).json({ message: 'Team not found or not authorized' });
    }
  } catch (error) {
    console.error('Error fetching team:', error);
    return res.status(500).json({ message: 'Error fetching team' });
  }
}
export async function composeTeam(req, res) {
  const { nomequip, nom } = req.body;
  const correu = req.userId;

  if (!nomequip || !nom) {
    return res.status(400).json({ message: 'Missing required parameters: nomequip, nom' });
  }

  try {
    const checkQuery = 'SELECT * FROM practica.equip WHERE nomequip = $1 AND correu = $2';
    const checkResult = await pool.query(checkQuery, [nomequip, correu]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Team not found or not authorized' });
    }

    // Insertar el personaje en la tabla de componentes
    const insertQuery = 'INSERT INTO practica.componen (nomequip, nom) VALUES ($1, $2) RETURNING *';
    const insertResult = await pool.query(insertQuery, [nomequip, nom]);

    return res.json(insertResult.rows[0]);
  } catch (error) {
    console.error('Error composing team:', error);
    return res.status(500).json({ message: 'Error composing team' });
  }
}
export async function createTeam(req, res) {
  const { nomequip } = req.body;
  const correu = req.userId;

  if (!nomequip) {
    return res.status(400).json({ message: 'Missing required parameter: nomequip' });
  }

  try {
    const query = 'INSERT INTO practica.equip (nomequip, correu) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [nomequip, correu]);

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating team:', error);
    return res.status(500).json({ message: 'Error creating team' });
  }
}

export async function deleteTeam(req, res) {
  const { nomequip } = req.params;
  const correu = req.userId;

  try {
    const query = 'DELETE FROM practica.equip WHERE nomequip = $1 AND correu = $2';
    const result = await pool.query(query, [nomequip, correu]);

    if (result.rowCount > 0) {
      return res.json({ message: 'Team deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Team not found or not authorized' });
    }
  } catch (error) {
    console.error('Error deleting team:', error);
    return res.status(500).json({ message: 'Error deleting team' });
  }
}