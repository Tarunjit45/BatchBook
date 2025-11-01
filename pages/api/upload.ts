import { NextApiResponse } from 'next';
import type { NextApiRequest } from 'next';
import dbConnect from '@/lib/dbConnect';
import Photo from '@/models/Photo';
import { createHandler, getUploadedFiles } from '@/middleware/multer';
import { getSession } from 'next-auth/react';
import { uploadFile } from '@/lib/storage';

// Define request type with file support
interface NextApiRequestWithUser extends NextApiRequest {
  user?: any;
  file?: Express.Multer.File;
  files?: {
    [fieldname: string]: Express.Multer.File[];
  } | Express.Multer.File[];
  body: {
    [key: string]: any;
  };
}

// Initialize multer middleware
const uploadMiddleware = createHandler({
  fields: [
    { name: 'file', maxCount: 1 },
    { name: 'fullName', maxCount: 1 },
    { name: 'schoolName', maxCount: 1 },
    { name: 'graduationYear', maxCount: 1 },
    { name: 'memoryTitle', maxCount: 1 },
    { name: 'description', maxCount: 1 }
  ]
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  console.log('Upload request received');
  
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  try {
    // Check authentication (optional for testing)
    console.log('Checking session...');
    const session = await getSession({ req });
    console.log('Session:', session ? 'Authenticated' : 'Not authenticated');
    
    // Commented out for testing - uncomment in production
    // if (!session) {
    //   return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    // }
    
    // Process the file upload
    const files = getUploadedFiles(req);
    const file = Array.isArray(files) ? files[0] : files;
    
    if (!file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    console.log('Uploading file to Google Cloud Storage:', file.originalname);
    
    // Upload file to Google Cloud Storage
    const uploadedFile = await uploadFile(file, 'memories');
    
    console.log('File uploaded successfully:', uploadedFile.url);
    
    const photoData = {
      url: uploadedFile.url,
      name: uploadedFile.filename,
      mimeType: uploadedFile.mimetype,
      size: uploadedFile.size,
      uploadedBy: session?.user?.email || 'anonymous',
      metadata: {
        fullName: req.body.fullName || 'Anonymous',
        schoolName: req.body.schoolName || 'Unknown School',
        graduationYear: parseInt(req.body.graduationYear) || new Date().getFullYear(),
        title: req.body.memoryTitle || 'Untitled Memory',
        description: req.body.description || ''
      }
    };

    // Try to save to database (optional if MongoDB is not connected)
    try {
      await dbConnect();
      const photo = new Photo(photoData);
      await photo.save();
      console.log('Photo saved to database');
      
      return res.status(200).json({ 
        status: 'success',
        message: 'File uploaded successfully',
        file: {
          id: photo._id,
          url: photoData.url,
          name: photoData.name
        }
      });
    } catch (dbError) {
      console.warn('Database save failed, but file was uploaded:', dbError);
      // Return success anyway since file was uploaded to GCS
      return res.status(200).json({ 
        status: 'success',
        message: 'File uploaded successfully (database unavailable)',
        file: {
          url: photoData.url,
          name: photoData.name,
          size: photoData.size
        }
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({
      status: 'error',
      message: 'Failed to process upload',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
}

// Apply the multer middleware to the handler
export default function uploadHandler(req: NextApiRequestWithUser, res: NextApiResponse) {
  uploadMiddleware(req, res, (err: unknown) => {
    if (err) {
      console.error('Upload middleware error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process file upload';
      return res.status(400).json({
        status: 'error',
        message: 'Failed to process file upload',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      });
    }
    return handler(req, res);
  });
}

// Disable body parsing to handle file uploads
export const config = {
  api: {
    bodyParser: false
  }
};
