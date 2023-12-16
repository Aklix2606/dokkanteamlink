import { Router } from 'express';
import { getCharacter } from '../controllers/characterController';
const router = Router();

// RESTful API endpoints for characters
router.get('/characters', getCharacter);

export default router;