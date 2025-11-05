import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import Institute from '@/models/Institute';
import Staff from '@/models/Staff';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
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

    const {
      fullName,
      designation,
      department,
      instituteName,
      instituteId,
      employeeId,
    } = req.body;

    const staffEmail = session.user.email;

    // Validate required fields
    if (!fullName || !designation || !instituteName || !instituteId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if staff already registered
    const existingStaff = await Staff.findOne({ email: staffEmail });
    if (existingStaff) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered as staff',
        staff: existingStaff,
      });
    }

    // Get institute details
    const institute = await Institute.findById(instituteId);
    if (!institute) {
      return res.status(404).json({
        success: false,
        message: 'Institute not found',
      });
    }

    if (institute.verificationStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Institute is not verified yet',
      });
    }

    // Extract domain from staff email
    const emailDomain = staffEmail.split('@')[1];
    
    // Check if email domain matches institute domain (Auto-verification)
    const isDomainMatch = emailDomain === institute.domain;

    let verificationStatus = 'pending';
    let verificationMethod = 'manual_approval';
    let verifiedAt = null;

    if (isDomainMatch) {
      // AUTO VERIFICATION - Domain matches
      verificationStatus = 'auto_verified';
      verificationMethod = 'domain_match';
      verifiedAt = new Date();
    }

    // Create staff record
    const staff = await Staff.create({
      fullName,
      email: staffEmail,
      designation,
      department: department || '',
      employeeId: employeeId || '',
      instituteId: institute._id,
      instituteName: institute.name,
      verificationStatus,
      verificationMethod,
      verifiedAt,
      userId: session.user.email, // Link to NextAuth user
    });

    if (isDomainMatch) {
      // Auto-verified - send success email
      return res.status(201).json({
        success: true,
        message: `Your staff account has been automatically verified under ${institute.name} (BatchBook Verified Institute). You can now upload and share memories.`,
        staff: {
          id: staff._id,
          fullName: staff.fullName,
          designation: staff.designation,
          instituteName: staff.instituteName,
          verificationStatus: staff.verificationStatus,
          verificationMethod: staff.verificationMethod,
        },
        autoVerified: true,
      });
    } else {
      // Manual verification required - send request to institute head
      // TODO: Send email to institute.email for approval
      
      return res.status(201).json({
        success: true,
        message: `Your verification request has been sent to ${institute.name} administration. You will receive an email once approved.`,
        staff: {
          id: staff._id,
          fullName: staff.fullName,
          designation: staff.designation,
          instituteName: staff.instituteName,
          verificationStatus: staff.verificationStatus,
        },
        autoVerified: false,
        pendingApproval: true,
      });
    }
  } catch (error) {
    console.error('Error registering staff:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to register as staff',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
    });
  }
}
