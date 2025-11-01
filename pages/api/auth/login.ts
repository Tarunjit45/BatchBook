import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    // For now, just return a success response
    // In a real app, you would validate credentials and return a token
    return res.status(200).json({ 
      status: 'success',
      message: 'Login successful',
      user: {
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@example.com'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to process login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
