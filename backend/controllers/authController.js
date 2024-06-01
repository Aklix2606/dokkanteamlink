// controllers/authController.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { pool } from '../utils/connectDB.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    const query = 'SELECT * FROM practica.jugador WHERE correu = $1 AND contrasenya = $2';
    const values = [username, password]; // Asumiendo que username es 'correu' y password es 'contrasenya'
    
    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (!user) {
      return res.status(403).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.correu }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
