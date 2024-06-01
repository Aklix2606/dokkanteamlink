import { Router } from 'express';
import { getPersonatgeStatsByNom } from '../controllers/characterController.js';
import { verifyToken } from '../controllers/authController.js';
import { getPersonatgesInvocatsByJugador, getCountPersonatgesInvocatsByJugador } from '../controllers/piController.js';

const characterRoutes = Router();

// RESTful API endpoints for characters
//characterRoutes.get('/characters', getCharacter);
//characterRoutes.get('/characters/:characterId', getCharacterById);
characterRoutes.get('/personatgesinvocats', verifyToken, getPersonatgesInvocatsByJugador);
characterRoutes.get('/personatgesinvocats/count', verifyToken, getCountPersonatgesInvocatsByJugador);
characterRoutes.get('/personatge/stats/:nom', getPersonatgeStatsByNom);




export default characterRoutes;