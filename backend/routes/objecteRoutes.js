import { Router } from 'express';
import { getObjecteByNumobj, getObjecteDisponible } from '../controllers/objecteController.js';
import { verifyToken } from '../controllers/authController.js';

const objecteRoutes = Router();

objecteRoutes.get('/objecte/consulta/:numobj', verifyToken, getObjecteByNumobj);
objecteRoutes.get('/objecte/disponible', verifyToken, getObjecteDisponible);

export default objecteRoutes;