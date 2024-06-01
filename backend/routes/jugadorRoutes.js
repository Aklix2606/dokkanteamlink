import { Router } from 'express';
import { postJugador, getCurrentJugador } from '../controllers/jugadorController.js';
import { loginUser, verifyToken } from '../controllers/authController.js';

const jugadorRoutes = Router();

jugadorRoutes.post('/login', loginUser);
jugadorRoutes.post('/register', postJugador);
jugadorRoutes.get('/jugadors/me', verifyToken, getCurrentJugador);

export default jugadorRoutes;

/*import { Router } from 'express';
import { postUser, updateUserTeams, getCurrentUser} from '../controllers/userController.js';
import { loginUser, verifyToken } from '../controllers/authController.js';

const userRoutes = Router();

userRoutes.post('/login', loginUser);
userRoutes.post('/register', postUser);
userRoutes.put('/users/:userId/teams', verifyToken, updateUserTeams);
userRoutes.get('/users/me', verifyToken, getCurrentUser);

export default userRoutes;*/