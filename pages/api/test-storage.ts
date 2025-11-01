import { NextApiRequest, NextApiResponse } from 'next';
import { bucket } from '@/lib/storage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Test 1: Check if bucket exists
    const [exists] = await bucket.exists();
    
    if (!exists) {
      return res.status(500).json({
        success: false,
        message: 'Bucket does not exist',
        details: {
          bucketName: process.env.GCS_BUCKET_NAME,
          projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
        }
      });
    }

    // Test 2: Try to get bucket metadata
    const [metadata] = await bucket.getMetadata();

    // Test 3: List files in bucket (first 5)
    const [files] = await bucket.getFiles({ maxResults: 5 });

    return res.status(200).json({
      success: true,
      message: 'Google Cloud Storage is working correctly',
      details: {
        bucketName: bucket.name,
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        bucketLocation: metadata.location,
        bucketStorageClass: metadata.storageClass,
        fileCount: files.length,
        files: files.map(file => ({
          name: file.name,
          size: file.metadata.size,
          created: file.metadata.timeCreated
        }))
      }
    });
  } catch (error) {
    console.error('Storage test error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to connect to Google Cloud Storage',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: {
        bucketName: process.env.GCS_BUCKET_NAME,
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
      }
    });
  }
}
