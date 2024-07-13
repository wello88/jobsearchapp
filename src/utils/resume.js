import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { cloudinary } from './cloud.js';


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_resumes',
    allowed_formats: ['pdf'],
    resource_type: 'raw',
  },
});


const upload = multer({ storage });

export default upload;