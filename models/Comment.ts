import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  photo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo',
    required: [true, 'Photo ID is required'],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: [500, 'Comment cannot be more than 500 characters'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  replies: [{
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
});

// Index for faster querying
commentSchema.index({ photo_id: 1, timestamp: -1 });

export default mongoose.models.Comment || mongoose.model('Comment', commentSchema);
