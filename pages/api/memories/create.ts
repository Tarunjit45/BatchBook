// pages/api/memories/create.ts
import { NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '../../../lib/db';
import { uploadFile } from '../../../lib/storage';
import createHandler from '../../../middleware/multer';
import { authOptions } from '../auth/[...nextauth]';

interface CreateMemoryRequest extends NextApiRequest {
  file: Express.Multer.File;
  body: {
    title: string;
    description?: string;
    schoolName: string;
    year: string | number;
  };
}

const handler = createHandler();

handler.post(async (req: CreateMemoryRequest, res: NextApiResponse) => {
  console.log('=== Memory Creation Started ===');
  try {
    const session = await getServerSession(req, res, authOptions);
    console.log('Session data:', session);
    
    if (!session?.user?.id) {
      console.log('Unauthorized: No user session found');
      return res.status(401).json({ 
        success: false,
        message: 'Not authenticated' 
      });
    }

    console.log('Connecting to database...');
    const { db } = await connectToDatabase();
    console.log('Database connected successfully');
    
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
      imageUrl = await uploadFile(file);
      console.log('File uploaded successfully. URL:', imageUrl);
    } catch (uploadError) {
      console.error('File upload failed:', uploadError);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload image',
        error: uploadError.message
      });
    }

    try {
      const memoryData = {
        title: title.trim(),
        description: description?.trim(),
        schoolName: schoolName.trim(),
        year: parseInt(year.toString()),
        imageUrl,
        userId: session.user.id,
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

      const createdMemory = await db.collection('memories').aggregate([
        { $match: { _id: result.insertedId } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            'user.password': 0,
            'user.email': 0
          }
        },
        {
          $addFields: {
            likeCount: { $size: '$likes' },
            commentCount: { $size: '$comments' },
            isLiked: false
          }
        }
      ]).next();

      return res.status(201).json({
        success: true,
        data: createdMemory
      });
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      try {
        // You might want to implement a cleanup function in storage.ts
        // to delete the uploaded file if database operation fails
        // await deleteFile(imageUrl);
      } catch (cleanupError) {
        console.error('Failed to clean up uploaded file:', cleanupError);
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to save memory',
        error: dbError.message
      });
    }
  } catch (error) {
    console.error('Unexpected error in create memory:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default handler;