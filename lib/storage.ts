// lib/storage.ts
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

if (!process.env.GOOGLE_CLOUD_PROJECT_ID) {
  throw new Error('GOOGLE_CLOUD_PROJECT_ID environment variable is not set');
}

if (!process.env.GCS_BUCKET_NAME) {
  throw new Error('GCS_BUCKET_NAME environment variable is not set');
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set');
}

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
});

export const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

export interface UploadedFile {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
  createdAt: Date;
}

export async function uploadFile(file: Express.Multer.File, folder = 'memories'): Promise<UploadedFile> {
  if (!file) {
    throw new Error('No file provided');
  }

  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error(`File size exceeds the limit of ${maxSize / (1024 * 1024)}MB`);
  }

  // Validate file type
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`);
  }

  const filename = `${folder}/${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '-')}`;
  const blob = bucket.file(filename);
  
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
      cacheControl: 'public, max-age=31536000',
    },
    resumable: false
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (error) => {
      console.error('Upload error:', error);
      reject(new Error('Failed to upload file to storage'));
    });

    blobStream.on('finish', async () => {
      try {
        // Generate a signed URL that expires in 100 years (effectively permanent for this use case)
        // Or use a very long expiration for public-like access
        const [signedUrl] = await blob.getSignedUrl({
          action: 'read',
          expires: Date.now() + 1000 * 60 * 60 * 24 * 365 * 100, // 100 years
        });
        
        resolve({
          url: signedUrl,
          filename: blob.name,
          size: file.size,
          mimetype: file.mimetype,
          createdAt: new Date()
        });
      } catch (error) {
        console.error('Error generating signed URL:', error);
        // If signed URL fails, return the GCS URL (will require authentication)
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve({
          url: publicUrl,
          filename: blob.name,
          size: file.size,
          mimetype: file.mimetype,
          createdAt: new Date()
        });
      }
    });

    blobStream.end(file.buffer);
  });
}

export async function deleteFile(url: string): Promise<void> {
  try {
    const filePath = url.split(`${bucket.name}/`)[1];
    if (!filePath) {
      throw new Error('Invalid file URL');
    }
    
    const file = bucket.file(filePath);
    await file.delete();
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
}

export async function getFileMetadata(url: string) {
  try {
    const filePath = url.split(`${bucket.name}/`)[1];
    if (!filePath) {
      throw new Error('Invalid file URL');
    }
    
    const [metadata] = await bucket.file(filePath).getMetadata();
    return metadata;
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw new Error('Failed to get file metadata');
  }
}