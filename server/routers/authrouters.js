import express from 'express';
import {
  signup,
  login,
  forgotpassword,
} from '../controllers/authcontrollers.js';

const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotpassword', forgotpassword);

export default router;
