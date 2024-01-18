import { Router } from 'express';
import { getTeams, deleteTeam } from '../controllers/teamsController.js';
import { verifyToken } from '../controllers/authController.js';

const teamsRoutes = Router();

teamsRoutes.get('/teams', verifyToken, getTeams);
teamsRoutes.delete('/teams/:teamId', verifyToken, deleteTeam);
  
export default teamsRoutes;