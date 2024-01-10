import { Router } from 'express';
import { getCharacter, getCharacterById } from '../controllers/characterController.js';

const characterRoutes = Router();

// RESTful API endpoints for characters
characterRoutes.get('/characters', getCharacter);
characterRoutes.get('/characters/:characterId', getCharacterById);

export default characterRoutes;