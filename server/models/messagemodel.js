import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    seenBy: [],
    text: String,
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
