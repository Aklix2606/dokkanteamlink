import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
});

export async function connectDB() {
    try {
        await pool.connect();
        console.log('Database connected');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
}

export { pool }; // Exporta la variable 'pool' para que pueda ser importada en otros archivos
