import express from 'express';
import dotenv from 'dotenv';
import {
  addcollege,
  delcollege,
  requestfordelete,
  updatecollege,
  getcollege,
} from '../controllers/collegecontrollers.js';
import { protect, restrict_to } from '../controllers/authcontrollers.js';

const router = express.Router();
//delete
router.delete('/del', delcollege);
router.use(protect);
router.use(restrict_to(['Admin']));
router.get('/deletecollegemail', requestfordelete);
//update
router.patch('/update', updatecollege);
router.get('/:id', getcollege);
//create
router.post('/create', restrict_to(['Owner']), addcollege);

export default router;
