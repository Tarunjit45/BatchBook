import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  role: 'user' | 'school_admin' | 'admin';
  school?: {
    name: string;
    year?: number;
    class?: string;
    batch?: string;
  };
  memories: Types.ObjectId[];
  likedMemories: Types.ObjectId[];
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
  bio?: string;
  socials?: {
    website?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  settings: {
    notifications: {
      email: boolean;
      push: boolean;
    };
    privacy: {
      profile: 'public' | 'private';
      memories: 'public' | 'private' | 'friends';
    };
  };
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword?: (candidatePassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    image: {
      type: String,
      default: '',
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'school_admin', 'admin'],
      default: 'user',
    },
    school: {
      name: {
        type: String,
        required: [
          function (this: IUser) {
            return this.role === 'school_admin';
          },
          'School name is required for school admins',
        ],
        trim: true,
      },
      year: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear() + 10,
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
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      trim: true,
      default: '',
    },
    socials: {
      website: {
        type: String,
        trim: true,
        match: [/^https?:\/\//, 'Please use a valid URL with HTTP/HTTPS'],
      },
      twitter: {
        type: String,
        trim: true,
      },
      instagram: {
        type: String,
        trim: true,
      },
      linkedin: {
        type: String,
        trim: true,
      },
    },
    settings: {
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
      },
      privacy: {
        profile: {
          type: String,
          enum: ['public', 'private'],
          default: 'public',
        },
        memories: {
          type: String,
          enum: ['public', 'private', 'friends'],
          default: 'public',
        },
      },
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ 'school.name': 1, 'school.year': 1 });
userSchema.index({ role: 1 });

// Virtual for user's memories
userSchema.virtual('memories', {
  ref: 'Memory',
  localField: '_id',
  foreignField: 'createdBy',
});

// Virtual for liked memories
userSchema.virtual('likedMemories', {
  ref: 'Memory',
  localField: '_id',
  foreignField: 'likes',
});

// Virtual for following
userSchema.virtual('following', {
  ref: 'User',
  localField: '_id',
  foreignField: 'followers',
});

// Virtual for followers
userSchema.virtual('followers', {
  ref: 'User',
  localField: '_id',
  foreignField: 'following',
});

// Pre-save hook to update lastActive timestamp
userSchema.pre('save', function (next) {
  this.lastActive = new Date();
  next();
});

// Method to get public profile
userSchema.methods.getPublicProfile = function (this: IUser) {
  const userObject = this.toObject();
  delete userObject.email;
  delete userObject.settings;
  delete userObject.role;
  delete userObject.updatedAt;
  return userObject;
};

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
