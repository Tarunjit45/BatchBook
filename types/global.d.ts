import { Mongoose } from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

// This export is needed for TypeScript to treat this file as a module
export {};
