import mongoose from 'mongoose';

const degreeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  totalYears: { type: Number, required: true },
  totalSemesters: { type: Number, required: true },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    Ref: 'College',
  },
  createdOn: { type: Date, default: Date.now },
});

const Degree = mongoose.model('Degree', degreeSchema);
export default Degree;
