import { Router } from 'express';
import { getPersonatgeStatsByNom, assignObjectToCharacter, invokeRandomCharacter, deleteInvokedCharacter } from '../controllers/characterController.js';
import { verifyToken } from '../controllers/authController.js';
import { getPersonatgesInvocatsByJugador, getCountPersonatgesInvocatsByJugador } from '../controllers/piController.js';

const characterRoutes = Router();

characterRoutes.get('/personatgesinvocats', verifyToken, getPersonatgesInvocatsByJugador);
characterRoutes.get('/personatgesinvocats/count', verifyToken, getCountPersonatgesInvocatsByJugador);
characterRoutes.get('/personatge/stats/:nom', verifyToken, getPersonatgeStatsByNom);
characterRoutes.post('/personatge/assigna', verifyToken, assignObjectToCharacter);
characterRoutes.post('/personatge/invoca', verifyToken, invokeRandomCharacter);
characterRoutes.delete('/personatgeinvocat/:nom', verifyToken, deleteInvokedCharacter);

export default characterRoutes;
