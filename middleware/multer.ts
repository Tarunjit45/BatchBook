// middleware/multer.ts
import multer, { FileFilterCallback, Options } from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import type { NextHandler } from 'next-connect';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Define custom request type with file
interface MulterRequest extends NextApiRequest {
  file?: Express.Multer.File;
  files?: {
    [fieldname: string]: Express.Multer.File[];
  } | Express.Multer.File[];
  user?: any; // User information from auth
}

// Configure multer
const multerOptions: Options = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5, // Maximum number of files
  },
  fileFilter: (
    req: any,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    // Allow only image files
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed!'));
    }
  },
};

const upload = multer(multerOptions);

// Helper function to handle multer errors
const handleMulterError = (err: any, res: NextApiResponse) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 5 files allowed.',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field in file upload.',
      });
    }
  } else if (err) {
    // An unknown error occurred
    console.error('File upload error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Error uploading file',
    });
  }
};

// Create a middleware to handle file uploads
export function createHandler(
  options: {
    single?: string;
    array?: { name: string; maxCount: number };
    fields?: { name: string; maxCount: number }[];
  } = { single: 'file' }
) {
  return (req: MulterRequest, res: NextApiResponse, callback: (err?: any) => void) => {
    // Create multer middleware based on options
    let multerMiddleware;
    
    if (options.single) {
      multerMiddleware = upload.single(options.single);
    } else if (options.array) {
      multerMiddleware = upload.array(options.array.name, options.array.maxCount);
    } else if (options.fields) {
      multerMiddleware = upload.fields(options.fields);
    } else {
      multerMiddleware = upload.single('file');
    }

    // Execute multer middleware
    multerMiddleware(req as any, res as any, (err: any) => {
      if (err) {
        handleMulterError(err, res);
        return;
      }
      callback();
    });
  };
}

// Helper to get the uploaded file(s) from the request
export function getUploadedFiles(req: MulterRequest): Express.Multer.File | Express.Multer.File[] | undefined {
  if (req.file) {
    return req.file;
  }
  if (req.files) {
    if (Array.isArray(req.files)) {
      return req.files;
    }
    // Handle case where files are in an object with field names as keys
    return Object.values(req.files).flat();
  }
  return undefined;
}