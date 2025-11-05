import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true,
    // e.g., "Teacher", "HOD", "Admin", "Professor"
  },
  department: {
    type: String,
    trim: true,
  },
  employeeId: {
    type: String,
    trim: true,
  },
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute',
    required: [true, 'Institute is required'],
  },
  instituteName: {
    type: String,
    required: true,
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'auto_verified', 'manually_verified', 'rejected'],
    default: 'pending',
  },
  verificationMethod: {
    type: String,
    enum: ['domain_match', 'manual_approval'],
  },
  verifiedAt: {
    type: Date,
  },
  verifiedBy: {
    type: String, // Email of person who verified (institute head or admin)
  },
  rejectedAt: {
    type: Date,
  },
  rejectionReason: {
    type: String,
  },
  profileImage: {
    type: String,
    default: '',
  },
  userId: {
    type: String, // NextAuth user ID
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

// Indexes
staffSchema.index({ email: 1 });
staffSchema.index({ instituteId: 1 });
staffSchema.index({ verificationStatus: 1 });

export default mongoose.models.Staff || mongoose.model('Staff', staffSchema);
