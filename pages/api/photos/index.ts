import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Photo from '@/models/Photo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    // Get search parameters
    const { school, year } = req.query;
    
    // Build search filter
    const filter: any = {};
    if (school) {
      filter['metadata.schoolName'] = { $regex: school, $options: 'i' }; // Case-insensitive search
    }
    if (year) {
      filter['metadata.graduationYear'] = parseInt(year as string);
    }
    
    // Get photos with optional filtering
    const photos = await Photo.find(filter)
      .sort({ uploadDate: -1 })
      .limit(50)
      .lean();

    // Transform to feed format
    const feedItems = photos.map((photo: any) => ({
      id: photo._id.toString(),
      imageUrl: photo.url,
      schoolName: photo.metadata.schoolName,
      uploaderName: photo.metadata.fullName,
      uploadDate: photo.uploadDate,
      year: photo.metadata.graduationYear,
      title: photo.metadata.title,
      description: photo.metadata.description || '',
      likes: 0,
      isLiked: false,
      comments: []
    }));

    return res.status(200).json({
      success: true,
      photos: feedItems
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    
    // Return empty array if database is not connected
    return res.status(200).json({
      success: false,
      photos: [],
      message: 'Database unavailable'
    });
  }
}
