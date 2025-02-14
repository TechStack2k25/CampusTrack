import express from 'express';
import {
  signup,
  login,
  forgotpassword,
  logout,
  resetpassword,
  updatepassword,
} from '../controllers/authcontrollers.js';

const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotpassword', forgotpassword);
router.post('/resetpassword', resetpassword);
router.get('/logout', logout);
export default router;
