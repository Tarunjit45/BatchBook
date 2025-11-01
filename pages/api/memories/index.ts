import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, collections } from '@/lib/db';
import { MemoryWithUser } from '@/types/memory';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    
    // Get the current user ID from session (you'll need to implement authentication)
    const userId = req.query.userId as string;
    
    // Get all memories with user information
    const memories = await db.collection(collections.memories)
      .aggregate([
        {
          $lookup: {
            from: collections.users,
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 1,
            imageUrl: 1,
            schoolName: 1,
            year: 1,
            title: 1,
            description: 1,
            createdAt: 1,
            updatedAt: 1,
            'user._id': 1,
            'user.name': 1,
            'user.avatar': 1,
            likeCount: { $size: '$likes' },
            commentCount: { $size: '$comments' },
            isLiked: {
              $cond: {
                if: { $in: [userId, '$likes.userId'] },
                then: true,
                else: false
              }
            }
          }
        },
        { $sort: { createdAt: -1 } }
      ])
      .toArray() as MemoryWithUser[];

    return res.status(200).json(memories);
  } catch (error) {
    console.error('Error fetching memories:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
