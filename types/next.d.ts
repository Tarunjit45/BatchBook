import { NextApiRequest } from 'next';
import { Session } from 'next-auth';

declare module 'next' {
  interface NextApiRequestWithUser extends NextApiRequest {
    user?: Session['user'];
    file?: Express.Multer.File;
    files?: {
      [fieldname: string]: Express.Multer.File[];
    } | Express.Multer.File[];
    body: {
      [key: string]: string | undefined;
    };
  }
}

declare global {
  namespace Express {
    interface User extends Session['user'] {}
  }
}
