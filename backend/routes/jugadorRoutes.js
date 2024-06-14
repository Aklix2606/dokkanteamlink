import { Router } from 'express';
import { postJugador, getCurrentJugador, updateJugadorContrasenya, deleteJugador } from '../controllers/jugadorController.js';
import { loginUser, verifyToken } from '../controllers/authController.js';

const jugadorRoutes = Router();

jugadorRoutes.post('/login', loginUser);
jugadorRoutes.post('/register', postJugador);
jugadorRoutes.get('/jugadors/me', verifyToken, getCurrentJugador);
jugadorRoutes.post('/cambiarContrasenya', verifyToken, updateJugadorContrasenya);
jugadorRoutes.delete('/jugadors', verifyToken, deleteJugador);

export default jugadorRoutes;
