import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Photo URL is required'],
  },
  name: {
    type: String,
    required: [true, 'File name is required'],
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required'],
  },
  size: {
    type: Number,
    required: [true, 'File size is required'],
  },
  uploadedBy: {
    type: String,
    required: [true, 'Uploader email is required'],
  },
  metadata: {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    schoolName: {
      type: String,
      required: [true, 'School name is required'],
      trim: true,
    },
    graduationYear: {
      type: Number,
      required: [true, 'Graduation year is required'],
      min: [1900, 'Year must be after 1900'],
      max: [new Date().getFullYear() + 6, 'Year cannot be more than 6 years in the future'],
    },
    title: {
      type: String,
      required: [true, 'Memory title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
});

// Index for faster search queries
photoSchema.index({ school_name: 'text', city: 'text', state: 'text', year: 1 });

export default mongoose.models.Photo || mongoose.model('Photo', photoSchema);
