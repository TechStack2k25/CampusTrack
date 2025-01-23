import express from 'express';

import {
  addcollege,
  delcollege,
  updatecollege,
} from '../controllers/collegecontrollers.js';

const router = express.Router();
//create
router.post('/create', addcollege);
//delete
router.delete('/del', delcollege);
//update
router.patch('/update/:id', updatecollege);
