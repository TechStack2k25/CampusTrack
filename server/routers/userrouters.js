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
} from '../controllers/usercontrollers.js';
import {
  activeuser,
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

router.get('/dashboard', get_dashboard);

router.post('/update_sem', restrict_to(['Admin']), update_sem);
export default router;
