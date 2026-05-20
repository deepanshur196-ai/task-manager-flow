import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept common document and media file types
  const acceptedExtensions = [
    '.png', '.jpg', '.jpeg', '.gif', '.svg',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.md', '.csv', '.json',
    '.zip', '.rar', '.7z'
  ];

  const ext = path.extname(file.originalname).toLowerCase();
  if (acceptedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${ext}`), false);
  }
};

export const upload = multer({ storage, fileFilter });
