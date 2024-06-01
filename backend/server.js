import express from 'express';
import next from 'next';
import jugadorRoutes from './routes/jugadorRoutes.js';
import characterRoutes from './routes/characterRoutes.js';
//import teamsRoutes from './routes/teamsRoutes.js';
import { connectDB } from './utils/connectDB.js';
import dotenv from 'dotenv';
import cors from 'cors';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

dotenv.config();
//Connect to DB
connectDB();
app.prepare().then(() => {
  const server = express();
  server.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE' 
  }));
  server.use(express.json());
  server.use('/api', jugadorRoutes);
  server.use('/api', characterRoutes);
  //server.use('/api', teamsRoutes);
  
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});

// import express from 'express';
// import userRoutes from './routes/userRoutes.js';
// import characterRoutes from './routes/characterRoutes.js';
// import teamsRoutes from './routes/teamsRoutes.js';
// import {connectDB} from './utils/connectDB.js';

// const app = express();

// const port = 3000;


// // Middleware to parse JSON in requests
// app.use(express.json());

// // Use the router for all routes defined above
// app.use('/user', userRoutes);
// app.use('/', characterRoutes);
// app.use('/user', teamsRoutes);

// //Connect to DB
// connectDB();

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });