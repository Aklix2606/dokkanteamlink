import { Router } from 'express';
import {
  getTeams,
  createTeam,
  deleteTeam,
  getTeam,
  composeTeam,
  getInvokedCharacters,
  removeCharacterFromTeam,
  updateTeamName,  // Añadido
} from '../controllers/teamsController.js';
import { verifyToken } from '../controllers/authController.js';

const teamsRoutes = Router();

teamsRoutes.get('/teams', verifyToken, getTeams);
teamsRoutes.post('/teams', verifyToken, createTeam);
teamsRoutes.get('/teams/:nomequip', verifyToken, getTeam);
teamsRoutes.post('/teams/:nomequip', verifyToken, composeTeam);
teamsRoutes.delete('/teams/:nomequip', verifyToken, deleteTeam);
teamsRoutes.get('/invokedCharacters', verifyToken, getInvokedCharacters);
teamsRoutes.delete('/teams/:nomequip/character', verifyToken, removeCharacterFromTeam);
teamsRoutes.put('/teams/:nomequip', verifyToken, updateTeamName); 

export default teamsRoutes;
