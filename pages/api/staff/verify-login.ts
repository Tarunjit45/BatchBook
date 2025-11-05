import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Staff from '@/models/Staff';

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

    const { email, fullName, employeeId } = req.body;

    // Validate required fields
    if (!email || !fullName || !employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Email, full name, and employee ID are required'
      });
    }

    // Find staff with matching details and verified status
    const staff = await Staff.findOne({
      email: { $regex: new RegExp(email, 'i') },
      fullName: { $regex: new RegExp(fullName, 'i') },
      employeeId: { $regex: new RegExp(employeeId, 'i') },
      verificationStatus: { $in: ['auto_verified', 'manually_verified'] }
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found or not verified. Please check your details or register first.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Staff verified successfully',
      staffId: staff._id
    });
  } catch (error) {
    console.error('Staff login verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during verification. Please try again.',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
    });
  }
}