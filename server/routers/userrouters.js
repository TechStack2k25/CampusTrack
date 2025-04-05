import express from 'express';
import {
  getall,
  deluser,
  updateuser,
  getprofile,
  get_dashboard,
  update_sem,
  sendEmail,
  getUserData,
  verifyuser,
  removefaculty,
} from '../controllers/usercontrollers.js';
import {
  activeuser,
  cachecontrol,
  protect,
  restrict_to,
  updatepassword,
} from '../controllers/authcontrollers.js';

const router = express.Router();
router.post('/verifyemail', verifyuser);
router.use(protect);
router.get('/me', getprofile);
router.get('/sendmail', sendEmail);
router.use(activeuser);
router.post('/updatepassword', updatepassword);
//get all user
router.get('/all', getall);
//delete
router.delete('/del', deluser);
//update
router.patch('/update', updateuser);

router.get('/mydata', getUserData);

router.get('/dashboard', cachecontrol, get_dashboard);
router.use(restrict_to(['Admin']));
router.post('/update_sem', update_sem);
router.post('/remove_faculty', removefaculty);
export default router;
