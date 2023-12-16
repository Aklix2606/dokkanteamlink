import express from 'express';
import userRoutes from './routes/userRoutes.js';
import characterRoutes from './routes/characterRoutes.js';
import teamsRoutes from './routes/teamsRoutes.js';
import {connectDB} from './utils/connectDB.js';

const app = express();

const port = 3000;


// Middleware to parse JSON in requests
app.use(express.json());

// Use the router for all routes defined above
app.use('/user', userRoutes);
app.use('/', characterRoutes);
app.use('/user', teamsRoutes);

//Connect to DB
connectDB();

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});