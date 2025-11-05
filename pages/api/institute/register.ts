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

    const {
      name,
      email,
      domain,
      logo,
      adminName,
      designation,
      contactNumber,
      address,
    } = req.body;

    // Validate required fields
    if (!name || !email || !domain || !adminName || !designation || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Extract domain from email and validate
    const emailDomain = email.split('@')[1];
    if (emailDomain !== domain) {
      return res.status(400).json({
        success: false,
        message: 'Email domain must match the provided domain',
      });
    }

    // Check if institute already exists
    const existingInstitute = await Institute.findOne({
      $or: [{ email }, { domain }],
    });

    if (existingInstitute) {
      return res.status(400).json({
        success: false,
        message: 'An institute with this email or domain is already registered',
      });
    }

    // Create new institute
    const institute = await Institute.create({
      name,
      email,
      domain,
      logo: logo || '',
      adminName,
      designation,
      contactNumber,
      address: address || {},
      verificationStatus: 'pending',
    });

    // TODO: Send email notification to BatchBook admin for verification
    // You can implement email service later

    return res.status(201).json({
      success: true,
      message: 'Institute registration submitted successfully. Our team will verify and approve your request soon.',
      institute: {
        id: institute._id,
        name: institute.name,
        email: institute.email,
        verificationStatus: institute.verificationStatus,
      },
    });
  } catch (error) {
    console.error('Error registering institute:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to register institute',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
    });
  }
}
