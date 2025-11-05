import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Institute from '@/models/Institute';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Get only approved institutes
    const institutes = await Institute.find({ 
      verificationStatus: 'approved' 
    }).select('name domain verificationStatus');

    return res.status(200).json({
      success: true,
      institutes: institutes.map(inst => ({
        _id: inst._id,
        name: inst.name,
        domain: inst.domain,
        verificationStatus: inst.verificationStatus,
      })),
    });
  } catch (error) {
    console.error('Error fetching institutes:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch institutes',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
    });
  }
}
