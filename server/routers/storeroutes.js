import express from 'express';
import {
  addresource,
  deleteresource,
  getall,
} from '../controllers/storecontrollers.js';
import { upload } from '../controllers/filescontrollers.js';
import { restrict_to } from '../controllers/authcontrollers.js';

const router = express.Router();
router.get('/getall/:id', getall);
router.delete('/delete/:id', restrict_to('faculty'), deleteresource);
router.post('/addresource/:id',restrict_to('faculty'), upload.single('file'), addresource);

export default router;
