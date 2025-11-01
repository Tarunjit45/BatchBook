import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  try {
    // Test database connection
    await dbConnect();
    
    // If we get here, the connection is successful
    return res.status(200).json({
      status: 'ok',
      message: 'Successfully connected to MongoDB!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to connect to MongoDB',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    });
  }
}
