import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-google-oauth2';
import dotenv from 'dotenv';
import { googleauthcallback } from '../controllers/authcontrollers.js';
dotenv.config({ path: '../variable.env' });

console.log(process.env.O_AUTH_CLIENT_SECRET);

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.O_AUTH_CLIENT_ID,
      clientSecret: process.env.O_AUTH_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
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
