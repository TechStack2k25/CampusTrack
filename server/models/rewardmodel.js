import mongoose from 'mongoose';

const rewardSchema = mongoose.Schema({
  total_point: {
    type: Number,
    default: 0,
  },
  spend_point: {
    type: Number,
    default: 0,
  },
  acheivement: [],
});
const Reward = mongoose.model('Reward', rewardSchema);

export default Reward;
