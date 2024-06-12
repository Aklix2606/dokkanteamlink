import express from 'express';
import { getGuildMembers, createGuild, leaveGuild, getAllGuilds, joinGuild } from '../controllers/guildController.js';
import { verifyToken } from '../controllers/authController.js';

const guildRoutes = express.Router();

guildRoutes.get('/membres', verifyToken, getGuildMembers);
guildRoutes.post('/crear', verifyToken, createGuild);
guildRoutes.post('/deixar', verifyToken, leaveGuild);
guildRoutes.get('/tots', verifyToken, getAllGuilds); // Nueva ruta para obtener todos los gremios
guildRoutes.post('/unir', verifyToken, joinGuild);   // Nueva ruta para unirse a un gremio

export default guildRoutes;
