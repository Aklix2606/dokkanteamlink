// routes/guildRoutes.js
import express from 'express';
import { getGuildMembers, createGuild, leaveGuild } from '../controllers/guildController.js';
import { verifyToken } from '../controllers/authController.js';

const guildRoutes = express.Router();

guildRoutes.get('/membres', verifyToken, getGuildMembers);
guildRoutes.post('/crear', verifyToken, createGuild);
guildRoutes.post('/deixar', verifyToken, leaveGuild);

export default guildRoutes;
