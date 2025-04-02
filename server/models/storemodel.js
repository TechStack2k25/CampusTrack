import mongoose, { Schema } from 'mongoose';
const courseStoreSchema = new Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  resource: String,
  lecture: {
    type: Number,
    default: 1,
  },
  part: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Store = mongoose.model('CourseStore', courseStoreSchema);

export default Store;
