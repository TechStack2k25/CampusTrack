import express from 'express';

import {
  getall,
  deluser,
  updateuser,
  getprofile,
  get_dashboard,
} from '../controllers/usercontrollers.js';
import { updatepassword } from '../controllers/authcontrollers.js';

const router = express.Router();

router.post('/updatepassword', updatepassword);
//get all user
router.get('/all', getall);
//delete
router.delete('/del', deluser);
//update
router.patch('/update', updateuser);
router.get('/me', getprofile);
router.get('/dashboard', get_dashboard);
export default router;
