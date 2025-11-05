import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import Staff from '@/models/Staff';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Check if user is registered as staff
    const staff = await Staff.findOne({ 
      email: session.user.email 
    }).populate('instituteId');

    if (!staff) {
      return res.status(200).json({
        success: true,
        isStaff: false,
        message: 'User is not registered as staff',
      });
    }

    // Check verification status
    const isVerified = staff.verificationStatus === 'auto_verified' || 
                      staff.verificationStatus === 'manually_verified';

    return res.status(200).json({
      success: true,
      isStaff: true,
      isVerified,
      staff: {
        id: staff._id,
        fullName: staff.fullName,
        email: staff.email,
        designation: staff.designation,
        department: staff.department,
        institute: staff.instituteId ? {
          id: staff.instituteId._id,
          name: staff.instituteId.name,
        } : null,
        verificationStatus: staff.verificationStatus,
      },
    });
  } catch (error) {
    console.error('Error checking staff status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check staff status',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
    });
  }
}
