import mongoose from 'mongoose';

const degreeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  totalYears: { type: Number, required: true, min: 1, max: 5 },
  totalSemesters: { type: Number, required: true, min: 1, max: 10 },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
  },
  createdOn: { type: Date, default: Date.now },
});

const Degree = mongoose.model('Degree', degreeSchema);
export default Degree;
