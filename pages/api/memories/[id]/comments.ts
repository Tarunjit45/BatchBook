import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, collections } from '@/lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const memoryId = req.query.id as string;
  const { db } = await connectToDatabase();

  switch (req.method) {
    case 'GET':
      return getComments();
    case 'POST':
      return addComment();
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }

  async function getComments() {
    try {
      const comments = await db.collection(collections.comments)
        .find({ memoryId: new ObjectId(memoryId) })
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async function addComment() {
    try {
      const { userId, text } = req.body;

      if (!userId || !text?.trim()) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Get user info (you might want to fetch this from your users collection)
      const user = await db.collection(collections.users).findOne(
        { _id: new ObjectId(userId) },
        { projection: { name: 1, avatar: 1 } }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const newComment = {
        memoryId: new ObjectId(memoryId),
        userId: new ObjectId(userId),
        userName: user.name,
        userAvatar: user.avatar,
        text: text.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add comment to comments collection
      const result = await db.collection(collections.comments).insertOne(newComment);
      
      // Also add a reference to the memory document
      await db.collection(collections.memories).updateOne(
        { _id: new ObjectId(memoryId) },
        {
          $push: {
            comments: {
              _id: result.insertedId,
              userId: newComment.userId,
              text: newComment.text,
              createdAt: newComment.createdAt
            }
          },
          $set: { updatedAt: new Date() }
        }
      );

      // Get the comment count
      const commentCount = await db.collection(collections.comments)
        .countDocuments({ memoryId: new ObjectId(memoryId) });

      return res.status(201).json({
        ...newComment,
        _id: result.insertedId,
        commentCount
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
