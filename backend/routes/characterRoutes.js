import { Router } from 'express';
import { getCharacter } from '../controllers/characterController.js';

const characterRoutes = Router();

// RESTful API endpoints for characters
characterRoutes.get('/characters', getCharacter);

export default characterRoutes;