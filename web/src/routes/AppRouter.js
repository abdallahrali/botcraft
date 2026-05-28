import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
import ServerController from '../controllers/ServerController.js';
import BotController from '../controllers/BotController.js';

const router = Router();

/**
 * Authentication Routes
 * Handles user lifecycle and session management.
 */
router.post('/auth/register', AuthController.handleRegister);
router.post('/auth/login', AuthController.handleLogin);
router.post('/auth/logout', AuthController.handleLogout);

/**
 * Minecraft Server Management Routes
 * Protected routes requiring an active session.
 */
router.get('/servers', ServerController.handleGetServers);
router.post('/servers/add', ServerController.handleAddServer);
router.delete('/servers/:id', ServerController.handleDeleteServer);

/**
 * Bot Configuration & Control Routes
 * Manages bot instances and their runtime configurations.
 */
router.get('/bots', BotController.handleGetBots);
router.post('/bots/start', BotController.handleStartBot);
router.post('/bots/stop', BotController.handleStopBot);
router.patch('/bots/:id/config', BotController.handleUpdateConfig);

export default router;
