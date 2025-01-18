import express from 'express';

import { getall, deluser, updateuser } from '../controllers/usercontrollers.js';

const router = express.Router();

//get all user
router.get('/all', getall);
//delete
router.delete('/del', deluser);
//update
router.patch('/update', updateuser);
