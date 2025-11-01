export interface Comment {
  _id: string;
  userId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Like {
  userId: string;
  createdAt: Date;
}

export interface Memory {
  _id?: string;
  userId: string;
  imageUrl: string;
  schoolName: string;
  year: number;
  title: string;
  description: string;
  comments: Comment[];
  likes: Like[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryWithUser extends Omit<Memory, 'userId'> {
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
}
