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

    // Get all institutes (for admin panel)
    const institutes = await Institute.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      institutes: institutes.map(inst => ({
        _id: inst._id,
        name: inst.name,
        email: inst.email,
        domain: inst.domain,
        adminName: inst.adminName,
        designation: inst.designation,
        contactNumber: inst.contactNumber,
        verificationStatus: inst.verificationStatus,
        createdAt: inst.createdAt,
        verifiedAt: inst.verifiedAt,
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
