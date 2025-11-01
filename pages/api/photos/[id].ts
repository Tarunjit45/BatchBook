import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid photo ID' });
  }

  // Get user session
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  try {
    const { db } = await connectToDatabase();
    const photosCollection = db.collection('photos');

    switch (req.method) {
      case 'GET':
        return handleGet(photosCollection, id, res);
      
      case 'PUT':
        return handleUpdate(photosCollection, id, session.user.email, req, res);
      
      case 'DELETE':
        return handleDelete(photosCollection, id, session.user.email, res);
      
      default:
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    });
  }
}

async function handleGet(collection: any, id: string, res: NextApiResponse) {
  try {
    const photo = await collection.findOne({ _id: new ObjectId(id) });

    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    return res.status(200).json({
      success: true,
      photo: {
        id: photo._id.toString(),
        imageUrl: photo.url,
        schoolName: photo.metadata?.schoolName || '',
        uploaderName: photo.metadata?.fullName || photo.uploadedBy,
        uploaderEmail: photo.uploadedBy,
        uploadDate: photo.uploadDate || photo.createdAt,
        year: photo.metadata?.graduationYear || new Date().getFullYear(),
        title: photo.metadata?.title || 'Untitled',
        description: photo.metadata?.description || '',
        likes: 0,
        isLiked: false,
        comments: []
      }
    });
  } catch (error) {
    console.error('Error fetching photo:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch photo' });
  }
}

async function handleUpdate(
  collection: any, 
  id: string, 
  userEmail: string, 
  req: NextApiRequest, 
  res: NextApiResponse
) {
  try {
    const { title, description } = req.body;

    if (!title && !description) {
      return res.status(400).json({ success: false, message: 'No data to update' });
    }

    // First, check if the photo exists and belongs to the user
    const photo = await collection.findOne({ _id: new ObjectId(id) });

    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    if (photo.uploadedBy !== userEmail) {
      return res.status(403).json({ success: false, message: 'You can only edit your own photos' });
    }

    // Update the photo
    const updateData: any = {
      updatedAt: new Date()
    };

    if (title) {
      updateData['metadata.title'] = title;
    }

    if (description !== undefined) {
      updateData['metadata.description'] = description;
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ success: false, message: 'No changes made' });
    }

    return res.status(200).json({
      success: true,
      message: 'Photo updated successfully',
      data: {
        title,
        description
      }
    });
  } catch (error) {
    console.error('Error updating photo:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to update photo',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    });
  }
}

async function handleDelete(
  collection: any, 
  id: string, 
  userEmail: string, 
  res: NextApiResponse
) {
  try {
    // First, check if the photo exists and belongs to the user
    const photo = await collection.findOne({ _id: new ObjectId(id) });

    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    if (photo.uploadedBy !== userEmail) {
      return res.status(403).json({ success: false, message: 'You can only delete your own photos' });
    }

    // Delete the photo
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(400).json({ success: false, message: 'Failed to delete photo' });
    }

    // TODO: Also delete the file from Google Cloud Storage if needed
    // You can implement this by calling a delete function from lib/storage.ts

    return res.status(200).json({
      success: true,
      message: 'Photo deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to delete photo',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    });
  }
}
