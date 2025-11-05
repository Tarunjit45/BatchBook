import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import Institute from '@/models/Institute';
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

    // Find institute by email (assuming institute email is used for login)
    const institute = await Institute.findOne({ 
      email: session.user.email 
    });

    if (!institute) {
      return res.status(404).json({
        success: false,
        message: 'Institute profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      institute: {
        _id: institute._id,
        name: institute.name,
        email: institute.email,
        domain: institute.domain,
        adminName: institute.adminName,
        designation: institute.designation,
        contactNumber: institute.contactNumber,
        address: institute.address,
        verificationStatus: institute.verificationStatus,
        createdAt: institute.createdAt,
        verifiedAt: institute.verifiedAt,
        verifiedBy: institute.verifiedBy,
      },
    });
  } catch (error) {
    console.error('Error fetching institute profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch institute profile',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
    });
  }
}