import { Router } from 'express';
import { postUser } from '../controllers/userController';

const router = Router();

router.post('/register', postUser);
  
export default router;