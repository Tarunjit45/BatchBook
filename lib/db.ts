import { MongoClient, Db, MongoClientOptions } from 'mongodb';

if (!process.env.MONGODB_URI) {
  console.warn('⚠️  MONGODB_URI is not defined in environment variables');
}

if (!process.env.MONGODB_DB) {
  console.warn('⚠️  MONGODB_DB is not defined in environment variables');
}

// Collection names
export const collections = {
  users: 'users',
  memories: 'memories',
  photos: 'photos',
  comments: 'comments',
  institutions: 'institutions'
};

// Global variables to cache the client and DB connection
let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
  if (client && db) {
    return { client, db };
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  const options: MongoClientOptions = {
    retryWrites: true,
    w: 'majority',
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    }
  };

  try {
    // Create a new MongoClient
    client = new MongoClient(process.env.MONGODB_URI, options);
    
    // Connect the client to the server
    await client.connect();
    
    // Connect to the specific database
    db = client.db(process.env.MONGODB_DB);
    
    // Test the connection
    await db.command({ ping: 1 });
    console.log('✅ Successfully connected to MongoDB');
    
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    
    // Ensure the client is closed if there's an error
    if (client) {
      await client.close();
    }
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred while connecting to MongoDB';
    
    throw new Error(`Failed to connect to MongoDB: ${errorMessage}`);
  }
}

// Handle application termination
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  }
});
 