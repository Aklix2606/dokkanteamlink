import { Router } from 'express';
import {getUserById, postUser, deleteUser, updateUser} from '../controllers/userController.js';
import {  loginUser, verifyToken } from '../controllers/authController.js';

const userRoutes = Router();

userRoutes.post('/login', loginUser);
userRoutes.post('/register', postUser);
userRoutes.delete('/deleteaccount/:userId', deleteUser);
userRoutes.put('/updateaccount/:userId', updateUser);



  

  
export default userRoutes;