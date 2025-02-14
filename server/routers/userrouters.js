import express from 'express';

import { getall, deluser, updateuser } from '../controllers/usercontrollers.js';
import { updatepassword } from '../controllers/authcontrollers.js';

const router = express.Router();

router.post('/updatepassword', updatepassword);
//get all user
router.get('/all', getall);
//delete
router.delete('/del', deluser);
//update
router.patch('/update', updateuser);

export default router;
