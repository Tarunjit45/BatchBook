import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.warn('Please define the MONGODB_URI environment variable inside .env.local');
}

// Define the shape of our cached connection
interface CachedConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Initialize the cache
let cached: CachedConnection = (global as any).mongoose || { conn: null, promise: null };

// Assign the cache to global in development
if (process.env.NODE_ENV !== 'production') {
  (global as any).mongoose = cached;
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
