import { pool } from '../utils/connectDB.js';

export async function getInvokedCharacters(req, res) {
  const correu = req.userId;

  try {
    const query = `
      SELECT p.nom, p.atac, p.vida, p.defensa, p.tipus
      FROM practica.personatgeinvocat pi
      JOIN practica.personatge p ON pi.nom = p.nom
      WHERE pi.correu = $1
    `;
    const result = await pool.query(query, [correu]);

    return res.json(result.rows);
  } catch (error) {
    console.error('Error fetching invoked characters:', error);
    return res.status(500).json({ message: 'Error fetching invoked characters' });
  }
}

export async function getTeams(req, res) {
  const correu = req.userId;

  try {
    const query = `
      SELECT 
        e.nomequip, 
        COALESCE(json_agg(json_build_object('nom', p.nom)) FILTER (WHERE p.nom IS NOT NULL), '[]') as characters
      FROM practica.equip e
      LEFT JOIN practica.componen c ON e.nomequip = c.nomequip
      LEFT JOIN practica.personatgeinvocat p ON c.nom = p.nom AND p.correu = $1
      WHERE e.correu = $1
      GROUP BY e.nomequip
    `;
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
    const query = `
      SELECT 
        e.nomequip, 
        COALESCE(json_agg(json_build_object('nom', p.nom)) FILTER (WHERE p.nom IS NOT NULL), '[]') as characters
      FROM practica.equip e
      LEFT JOIN practica.componen c ON e.nomequip = c.nomequip
      LEFT JOIN practica.personatgeinvocat p ON c.nom = p.nom AND p.correu = $2
      WHERE e.nomequip = $1 AND e.correu = $2
      GROUP BY e.nomequip
    `;
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
    await pool.query('BEGIN');

    const deleteComponentsQuery = 'DELETE FROM practica.componen WHERE nomequip = $1';
    await pool.query(deleteComponentsQuery, [nomequip]);

    const deleteTeamQuery = 'DELETE FROM practica.equip WHERE nomequip = $1 AND correu = $2';
    const result = await pool.query(deleteTeamQuery, [nomequip, correu]);

    if (result.rowCount > 0) {
      await pool.query('COMMIT');
      return res.json({ message: 'Team deleted successfully' });
    } else {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Team not found or not authorized' });
    }
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error deleting team:', error);
    return res.status(500).json({ message: 'Error deleting team' });
  }
}

export async function removeCharacterFromTeam(req, res) {
  const { nomequip } = req.params;
  const { nom } = req.body;
  const correu = req.userId;

  try {
    const query = 'DELETE FROM practica.componen WHERE nomequip = $1 AND nom = $2';
    const result = await pool.query(query, [nomequip, nom]);

    if (result.rowCount > 0) {
      return res.json({ message: 'Character removed from team successfully' });
    } else {
      return res.status(404).json({ message: 'Character not found in team' });
    }
  } catch (error) {
    console.error('Error removing character from team:', error);
    return res.status(500).json({ message: 'Error removing character from team' });
  }
}
