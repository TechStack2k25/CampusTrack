import express from 'express';

import {
  adddepartment,
  getall,
  deldepartment,
  updatedepartment,
} from '../controllers/departmentcontrollers.js';
import { restrict_to } from '../controllers/authcontrollers.js';

const router = express.Router();
//get all department
router.get('/all/:id', getall);
router.use(restrict_to('Admin'));
//create
router.post('/create/:id', adddepartment);

//delete
router.delete('/del/:id', deldepartment);
//update
router.patch('/update/:id', updatedepartment);

export default router;
