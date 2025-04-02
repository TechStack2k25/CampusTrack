import express from 'express';

import {
  getall,
  deluser,
  updateuser,
  getprofile,
  get_dashboard,
  update_sem,
  verifyuser,
  sendEmail,
  getUserData,
} from '../controllers/usercontrollers.js';
import {
  activeuser,
  restrict_to,
  updatepassword,
} from '../controllers/authcontrollers.js';

const router = express.Router();
router.get('/me', getprofile);
router.get('/sendmail', sendEmail);
router.post('/verifyemail', verifyuser);
router.post('/updatepassword', activeuser, updatepassword);
//get all user
router.get('/all', activeuser, getall);
//delete
router.delete('/del', activeuser, deluser);
//update
router.patch('/update', activeuser, updateuser);

router.get('/mydata', getUserData);
router.get('/dashboard', get_dashboard);

router.post('/update_sem', restrict_to('Admin'), update_sem);
export default router;
