import { Router } from 'express';
import { getTeams, postTeams, putTeams, deleteTeams } from '../controllers/teamController';

const router = Router();

router.get('/teams', getTeams);
router.post('/teams', postTeams);
router.put('/teams/:id', putTeams);
router.delete('/teams/:id', deleteTeams);
  
export default router;