import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;
const pool = new Pool({
    user: 'est_e7597461',
    password: 'dB.e7597461',
    host: 'ubiwan.epsevg.upc.edu',
    port: 5432,
    database: 'est_e7597461',
})

export async function connectDB() {
    try {
        await pool.connect();
        console.log('Database connected');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
}
