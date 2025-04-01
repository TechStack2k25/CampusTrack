import express from 'express';
import {
  addresource,
  deleteresource,
  getall,
} from '../controllers/storecontrollers.js';
import { upload } from '../controllers/filescontrollers.js';

const router = express.Router();
router.get('/getall/:id', getall);
router.patch('/delete/:id', deleteresource);
router.post('/addresource/:id', upload.single('file'), addresource);

export default router;
