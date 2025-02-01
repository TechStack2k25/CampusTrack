import express from 'express';
import {
  signup,
  login,
  forgotpassword,
  logout,
} from '../controllers/authcontrollers.js';

const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotpassword', forgotpassword);
router.get('/logout', logout);
export default router;
