import { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
    try {
        await connect(process.env.MONGODB_URL);
        console.log('Database connected');
    } catch (error) {
        console.error(error);
    }
}