import express from 'express';

import {
  addtask,
  getall,
  deltask,
  updatetask,
} from '../controllers/taskcontrollers.js';

const router = express.Router();
//create
router.post('/create', addtask);
//get all task
router.get('/all', getall);
//delete
router.delete('/del', deltask);
//update
router.patch('/update', updatetask);
