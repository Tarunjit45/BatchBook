import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Institute from '@/models/Institute';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { instituteId, action, adminEmail } = req.body;

    // Validate required fields
    if (!instituteId || !action || !adminEmail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide instituteId, action, and adminEmail',
      });
    }

    if (action !== 'approve' && action !== 'reject') {
      return res.status(400).json({
        success: false,
        message: 'Action must be either "approve" or "reject"',
      });
    }

    // Find and update institute
    const institute = await Institute.findById(instituteId);
    if (!institute) {
      return res.status(404).json({
        success: false,
        message: 'Institute not found',
      });
    }

    if (action === 'approve') {
      institute.verificationStatus = 'approved';
      institute.verifiedAt = new Date();
      institute.verifiedBy = adminEmail;
    } else if (action === 'reject') {
      institute.verificationStatus = 'rejected';
      institute.verifiedAt = new Date();
      institute.verifiedBy = adminEmail;
    }

    await institute.save();

    return res.status(200).json({
      success: true,
      message: `Institute ${action}d successfully`,
      institute: {
        _id: institute._id,
        name: institute.name,
        verificationStatus: institute.verificationStatus,
      },
    });
  } catch (error) {
    console.error('Error updating institute status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update institute status',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
    });
  }
}
