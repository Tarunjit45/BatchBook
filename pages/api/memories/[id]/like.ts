import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, collections } from '@/lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const memoryId = req.query.id as string;
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if the user already liked the memory
    const memory = await db.collection(collections.memories).findOne({
      _id: new ObjectId(memoryId),
      'likes.userId': userId
    });

    let updateResult;
    
    if (memory) {
      // Unlike the memory
      updateResult = await db.collection(collections.memories).updateOne(
        { _id: new ObjectId(memoryId) },
        { 
          $pull: { likes: { userId } } as any,
          $set: { updatedAt: new Date() }
        }
      );
    } else {
      // Like the memory
      updateResult = await db.collection(collections.memories).updateOne(
        { _id: new ObjectId(memoryId) },
        { 
          $push: { 
            likes: { 
              userId,
              createdAt: new Date()
            } 
          } as any,
          $set: { updatedAt: new Date() }
        }
      );
    }

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    // Get updated like count
    const updatedMemory = await db.collection(collections.memories).findOne(
      { _id: new ObjectId(memoryId) },
      { projection: { likes: 1 } }
    );

    return res.status(200).json({ 
      success: true, 
      isLiked: !memory,
      likeCount: updatedMemory?.likes?.length || 0
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
