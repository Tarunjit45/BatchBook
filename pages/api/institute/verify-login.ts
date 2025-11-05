import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Institute from '@/models/Institute';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    await dbConnect();

    const { instituteName, adminName, designation } = req.body;

    // Validate required fields
    if (!instituteName || !adminName || !designation) {
      return res.status(400).json({
        success: false,
        message: 'Institute name, administrator name, and designation are required'
      });
    }

    // Find institute with matching details
    const institute = await Institute.findOne({
      name: { $regex: new RegExp(instituteName, 'i') },
      adminName: { $regex: new RegExp(adminName, 'i') },
      designation: { $regex: new RegExp(designation, 'i') },
      verificationStatus: 'approved'
    });

    if (!institute) {
      return res.status(404).json({
        success: false,
        message: 'Institute not found or not approved. Please check your details or register first.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Institute verified successfully',
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
      }
    });
  } catch (error) {
    console.error('Institute login verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during verification. Please try again.',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
    });
  }
}