// controllers/personatgesController.js
import { pool } from '../utils/connectDB.js';

export async function getPersonatgesInvocatsByJugador(req, res) {
  const correu = req.userId;

  try {
    const query = 'SELECT * FROM practica.personatgeinvocat WHERE correu = $1';
    const values = [correu];

    const result = await pool.query(query, values);
    const personatges = result.rows;

    res.json(personatges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getCountPersonatgesInvocatsByJugador(req, res) {
    const correu = req.userId;
  
    try {
      const query = 'SELECT COUNT(*) FROM practica.personatgeinvocat WHERE correu = $1';
      const values = [correu];
  
      const result = await pool.query(query, values);
      const count = result.rows[0].count;
  
      res.json({ count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  

