import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Institute from '@/models/Institute';
import Staff from '@/models/Staff';
import Photo from '@/models/Photo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Get counts for different entities
    const instituteCount = await Institute.countDocuments();
    const approvedInstitutes = await Institute.countDocuments({ verificationStatus: 'approved' });
    const pendingInstitutes = await Institute.countDocuments({ verificationStatus: 'pending' });
    
    const staffCount = await Staff.countDocuments();
    const verifiedStaff = await Staff.countDocuments({ 
      verificationStatus: { $in: ['auto_verified', 'manually_verified'] } 
    });
    
    const photoCount = await Photo.countDocuments();

    return res.status(200).json({
      success: true,
      statistics: {
        institutes: {
          total: instituteCount,
          approved: approvedInstitutes,
          pending: pendingInstitutes,
        },
        staff: {
          total: staffCount,
          verified: verifiedStaff,
        },
        photos: {
          total: photoCount,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
    });
  }
}