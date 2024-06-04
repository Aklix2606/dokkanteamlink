import { Router } from 'express';
import { getPersonatgeStatsByNom, assignObjectToCharacter, invokeRandomCharacter } from '../controllers/characterController.js';
import { verifyToken } from '../controllers/authController.js';
import { getPersonatgesInvocatsByJugador, getCountPersonatgesInvocatsByJugador } from '../controllers/piController.js';

const characterRoutes = Router();

// RESTful API endpoints for characters
//characterRoutes.get('/characters', getCharacter);
//characterRoutes.get('/characters/:characterId', getCharacterById);
characterRoutes.get('/personatgesinvocats', verifyToken, getPersonatgesInvocatsByJugador);
characterRoutes.get('/personatgesinvocats/count', verifyToken, getCountPersonatgesInvocatsByJugador);
characterRoutes.get('/personatge/stats/:nom', verifyToken,getPersonatgeStatsByNom);
characterRoutes.post('/personatge/assigna', verifyToken, assignObjectToCharacter);
characterRoutes.post('/personatge/invoca', verifyToken, invokeRandomCharacter);




export default characterRoutes;