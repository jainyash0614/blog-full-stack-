import express from 'express';
import { register, login, logout, getCurrentUser } from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/user', isAuthenticated, getCurrentUser);

export default router;