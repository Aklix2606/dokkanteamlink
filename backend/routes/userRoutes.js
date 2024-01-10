import { Router } from 'express';
import {getUserById, postUser, deleteUser, updateUser} from '../controllers/userController.js';
const userRoutes = Router();

userRoutes.get('/login/:userId', getUserById);
userRoutes.post('/register', postUser);
userRoutes.delete('/deleteaccount/:userId', deleteUser);
userRoutes.put('/updateaccount/:userId', updateUser);
  
export default userRoutes;