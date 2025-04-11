import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-google-oauth2';
import dotenv from 'dotenv';
import { googleauthcallback } from '../controllers/authcontrollers.js';
dotenv.config({ path: '../variable.env' });
const isProduction = process.env.NODE_ENV === 'production';

const callbackURL = isProduction
  ? 'https://campustrack.onrender.com/api/auth/google/callback'
  : 'http://localhost:3000/api/auth/google/callback';

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.O_AUTH_CLIENT_ID,
      clientSecret: process.env.O_AUTH_CLIENT_SECRET,
      callbackURL: callbackURL,
      scope: ['profile', 'email'],
    },
    googleauthcallback
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
