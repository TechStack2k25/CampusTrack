import express from 'express';
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
//delete
router.delete('/del', delcollege);
//update
router.patch('/update', updatecollege);
router.get('/:id', getcollege);
//create
router.post('/create', restrict_to(['Owner']), addcollege);

export default router;
