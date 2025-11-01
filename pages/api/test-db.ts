import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    
    // Test connection by listing all collections
    const collections = await db.listCollections().toArray();
    
    // Count documents in memories collection if it exists
    let memoryCount = 0;
    const memoriesCollection = collections.find(c => c.name === 'memories');
    if (memoriesCollection) {
      memoryCount = await db.collection('memories').countDocuments();
    }

    return res.status(200).json({
      success: true,
      database: process.env.MONGODB_DB,
      collections: collections.map(c => c.name),
      memoryCount,
      sampleMemory: memoriesCollection 
        ? await db.collection('memories').findOne() 
        : 'No memories collection found'
    });
  } catch (error) {
    console.error('Database test error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to connect to database',
      error: error instanceof Error ? error.message : 'Unknown error',
      env: {
        mongodbUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
        mongodbDb: process.env.MONGODB_DB || 'Not set',
        nodeEnv: process.env.NODE_ENV || 'development'
      }
    });
  }
}
