import NextAuth, { NextAuthOptions } from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { connectToDatabase } from '@/lib/db';
import { MongoClient } from 'mongodb';
import GoogleProvider from 'next-auth/providers/google';

// Validate required environment variables
const requiredEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// MongoDB Client Promise
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

try {
  if (process.env.NODE_ENV === 'development') {
    // In development, use a global variable to preserve the connection across module reloads
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = connectToDatabase()
        .then(({ client }) => client)
        .catch((error) => {
          console.error('⚠️  MongoDB connection failed, auth features will be limited:', error.message);
          // Return a mock promise that will be caught by NextAuth
          throw error;
        });
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production, avoid using a global variable
    clientPromise = connectToDatabase()
      .then(({ client }) => client)
      .catch((error) => {
        console.error('⚠️  MongoDB connection failed, auth features will be limited:', error.message);
        throw error;
      });
  }
} catch (error) {
  console.error('⚠️  Failed to initialize MongoDB client promise');
  // Create a rejected promise as fallback
  clientPromise = Promise.reject(new Error('MongoDB connection failed'));
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile',
        },
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise as Promise<MongoClient>, {
    databaseName: process.env.MONGODB_DB,
  }),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        // Add user ID to the session
        session.user.id = token.sub || (user as any)?.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add custom JWT properties here if needed
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
