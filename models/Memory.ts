import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMemory extends Document {
  title: string;
  description?: string;
  media: {
    url: string;
    filename: string;
    mimetype: string;
    size: number;
  }[];
  school: {
    name: string;
    year: number;
    class?: string;
    batch?: string;
  };
  tags?: string[];
  createdBy: Types.ObjectId;
  isPublic: boolean;
  likes: Types.ObjectId[];
  comments: {
    user: Types.ObjectId;
    text: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const MemorySchema = new Schema<IMemory>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    media: [
      {
        url: { type: String, required: true },
        filename: { type: String, required: true },
        mimetype: { type: String, required: true },
        size: { type: Number, required: true },
      },
    ],
    school: {
      name: {
        type: String,
        required: [true, 'School name is required'],
        trim: true,
      },
      year: {
        type: Number,
        required: [true, 'Graduation year is required'],
        min: [1900, 'Invalid year'],
        max: [new Date().getFullYear() + 10, 'Invalid year'],
      },
      class: {
        type: String,
        trim: true,
      },
      batch: {
        type: String,
        trim: true,
      },
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
          maxlength: [1000, 'Comment cannot be more than 1000 characters'],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add indexes for better query performance
MemorySchema.index({ 'school.name': 1, 'school.year': 1 });
MemorySchema.index({ createdBy: 1 });
MemorySchema.index({ tags: 1 });
MemorySchema.index({ 'school.class': 1 });
MemorySchema.index({ 'school.batch': 1 });

// Virtual for like count
MemorySchema.virtual('likeCount').get(function (this: IMemory) {
  return this.likes.length;
});

// Virtual for comment count
MemorySchema.virtual('commentCount').get(function (this: IMemory) {
  return this.comments.length;
});

// Pre-save hook to ensure at least one media file is provided
MemorySchema.pre<IMemory>('save', function (next) {
  if (this.media.length === 0) {
    throw new Error('At least one media file is required');
  }
  next();
});

export default mongoose.models.Memory || mongoose.model<IMemory>('Memory', MemorySchema);
