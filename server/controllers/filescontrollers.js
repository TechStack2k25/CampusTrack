import multer from 'multer';
import ApiError from '../utils/apierror.js';

const multerstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/Assignment');
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split('/')[1];
    const task_id = req.params.id;
    cb(null, `user-${req.user._id}-task-${task_id}.${extension}`);
  },
});

const multerfilter = (req, file, cb) => {
  if (file.mimetype.startsWith('application')) {
    cb(null, true);
  } else cb(new ApiError('File Type must be pdf'));
};

export const upload = multer({
  storage: multerstorage,
  fileFilter: multerfilter,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});
