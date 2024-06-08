import { Router } from 'express';
import { getTeams, createTeam, deleteTeam, getTeam, composeTeam} from '../controllers/teamsController.js';
import { verifyToken } from '../controllers/authController.js';

const teamsRoutes = Router();

teamsRoutes.get('/teams', verifyToken, getTeams);
teamsRoutes.post('/teams', verifyToken, createTeam);
teamsRoutes.get('/teams/:nomequip', verifyToken, getTeam);
teamsRoutes.post('/teams/:nomequip', verifyToken, composeTeam);
teamsRoutes.delete('/teams/:nomequip', verifyToken, deleteTeam);




export default teamsRoutes;
