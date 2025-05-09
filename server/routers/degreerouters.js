import express from 'express';
import {
  adddegree,
  deletedegree,
  getall,
  getdegree,
  updatedegree,
} from '../controllers/degreecontrollers.js';
import { restrict_to } from '../controllers/authcontrollers.js';

const router = express.Router();
//get all degree  college id
router.get('/all/:id', getall);

//get a degree
router.get('/getdegree/:id', getdegree);
router.use(restrict_to(['Admin']));
//add degree college id
router.post('/add/:id', adddegree);
//delete degree id
router.delete('/del/:id', deletedegree);
//update degree id
router.patch('/update/:id', updatedegree);
export default router;
