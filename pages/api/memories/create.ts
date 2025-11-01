// pages/api/memories/create.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '../../../lib/db';
import { uploadFile } from '../../../lib/storage';
import { createHandler } from '../../../middleware/multer';
import { authOptions } from '../auth/[...nextauth]';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface CreateMemoryRequest extends NextApiRequest {
  file?: Express.Multer.File;
  body: {
    title: string;
    description?: string;
    schoolName: string;
    year: string | number;
  };
}

export default async function handler(req: CreateMemoryRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Handle file upload with multer
  const multerMiddleware = createHandler({ single: 'file' });
  
  return new Promise((resolve, reject) => {
    multerMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      try {
        console.log('=== Memory Creation Started ===');
        const session = await getServerSession(req as any, res, authOptions);
        console.log('Session data:', session);
        
        if (!session?.user?.email) {
          console.log('Unauthorized: No user session found');
          return res.status(401).json({ 
            success: false,
            message: 'Not authenticated' 
          });
        }

        const { title, description, schoolName, year } = req.body;
        const file = req.file;
        
        console.log('Request body:', { title, description, schoolName, year });
        console.log('File info:', file ? { 
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size 
        } : 'No file uploaded');

        if (!file) {
          console.log('No file uploaded');
          return res.status(400).json({ 
            success: false,
            message: 'No file uploaded' 
          });
        }

        let imageUrl: string;
        try {
          console.log('Uploading file to storage...');
          const uploadResult = await uploadFile(file);
          imageUrl = uploadResult.url;
          console.log('File uploaded successfully. URL:', imageUrl);
        } catch (uploadError) {
          console.error('File upload failed:', uploadError);
          return res.status(500).json({
            success: false,
            message: 'Failed to upload image',
            error: uploadError instanceof Error ? uploadError.message : 'Unknown error'
          });
        }

        try {
          console.log('Connecting to database...');
          const { db } = await connectToDatabase();
          console.log('Database connected successfully');

          const memoryData = {
            title: title.trim(),
            description: description?.trim(),
            schoolName: schoolName.trim(),
            year: parseInt(year.toString()),
            imageUrl,
            userEmail: session.user.email,
            likes: [],
            comments: [],
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          console.log('Saving to database:', memoryData);
          const result = await db.collection('memories').insertOne(memoryData);
          console.log('Database insert result:', result);

          if (!result.insertedId) {
            console.error('Failed to get insertedId from database');
            throw new Error('Failed to save memory to database');
          }

          return res.status(201).json({
            success: true,
            data: {
              _id: result.insertedId,
              ...memoryData
            }
          });
          
        } catch (dbError) {
          console.error('Database error:', dbError);
          return res.status(500).json({
            success: false,
            message: 'Failed to save memory',
            error: dbError instanceof Error ? dbError.message : 'Unknown error'
          });
        }
      } catch (error) {
        console.error('Unexpected error in create memory:', error);
        return res.status(500).json({ 
          success: false,
          message: 'Internal server error',
          error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
        });
      }
    });
  });
}