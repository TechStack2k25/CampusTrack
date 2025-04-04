import express from 'express';
import dotenv from 'dotenv';
import {
  addcollege,
  delcollege,
  requestfordelete,
  updatecollege,
  getcollege,
} from '../controllers/collegecontrollers.js';
import { restrict_to } from '../controllers/authcontrollers.js';

const router = express.Router();

router.get('/deletecollegemail', requestfordelete);
//create
router.post('/create', restrict_to('Owner'), addcollege);
//delete
router.delete('/del/:token', delcollege);
//update
router.patch('/update', updatecollege);

router.get('/:id', getcollege);

export default router;
