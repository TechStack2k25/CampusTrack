import express from 'express';
import passport from 'passport';
import {
  signup,
  login,
  forgotpassword,
  logout,
  resetpassword,
  updatepassword,
} from '../controllers/authcontrollers.js';
import dotenv from 'dotenv';
import { verifyuser } from '../controllers/usercontrollers.js';
// import passport from 'passport';

dotenv.config({ path: './variable.env' });
const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: `${process.env.FRONTEND_URL}/dashboard`,
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  (req, res) => {
    // Successful authentication
    console.log(req);
    if (req.user) {
      res.status(201).json({
        message: 'User Login Successfully',
        data: {
          user: req.user,
        },
      });
    } else {
      res.status(401).json({ message: 'User not authenticated' });
    }
  }
);

router.post('/forgotpassword', forgotpassword);
router.post('/resetpassword', resetpassword);
router.get('/logout', logout);
router.get('/verifyemail', verifyuser);
export default router;
