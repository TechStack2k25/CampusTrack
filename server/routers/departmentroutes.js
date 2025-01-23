import express from 'express';

import {
  adddepartment,
  getall,
  deldepartment,
  updatedepartment,
} from '../controllers/departmentcontrollers.js';

const router = express.Router();
//create
router.post('/create/:id', adddepartment);
//get all department
router.get('/all', getall);
//delete
router.delete('/del', deldepartment);
//update
router.patch('/update/:id', updatedepartment);

export default router;
