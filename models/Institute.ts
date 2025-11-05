import mongoose from 'mongoose';

const instituteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Institute name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Institute email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  domain: {
    type: String,
    required: [true, 'Email domain is required'],
    lowercase: true,
    trim: true,
    // e.g., "xyzcollege.edu.in"
  },
  logo: {
    type: String,
    default: '',
  },
  adminName: {
    type: String,
    required: [true, 'Admin name is required'],
    trim: true,
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true,
    // e.g., "Principal", "Dean", "Head"
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  verifiedAt: {
    type: Date,
  },
  verifiedBy: {
    type: String, // Admin email who verified
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster search
instituteSchema.index({ domain: 1 });
instituteSchema.index({ email: 1 });
instituteSchema.index({ verificationStatus: 1 });

export default mongoose.models.Institute || mongoose.model('Institute', instituteSchema);
