import mongoose from 'mongoose';

const institutionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Institution name is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
  },
  logo_url: {
    type: String,
    default: '',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Institution || mongoose.model('Institution', institutionSchema);
