import { Router } from 'express';
import { getTeams, postTeams, putTeams, deleteTeams } from '../controllers/teamsController.js';

const teamsRoutes = Router();

teamsRoutes.get('/teams', getTeams);
teamsRoutes.post('/teams', postTeams);
teamsRoutes.put('/teams/:id', putTeams);
teamsRoutes.delete('/teams/:id', deleteTeams);

teamsRoutes.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Accessed protected route' });
});
  
export default teamsRoutes;