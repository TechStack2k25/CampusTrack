import express from 'express';

import {
  addcollege,
  delcollege,
  updatecollege,
  getcollege,
} from '../controllers/collegecontrollers.js';

const router = express.Router();
//create
router.post('/create', addcollege);
//delete
router.delete('/del/:id', delcollege);
//update
router.patch('/update/:id', updatecollege);

router.get('/:id', getcollege);

export default router;
