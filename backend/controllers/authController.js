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
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    const actualToken = token.split(' ')[1]; // Esto elimina el prefijo "Bearer "

    jwt.verify(actualToken, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate token' });
        }

        req.userId = decoded.userId; 
        next();
    });
};
