// import multer from 'multer';
// import path from 'path';

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Temporary storage location
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['application/pdf'];
//   if (!allowedTypes.includes(file.mimetype)) {
//     const error = new Error('Incorrect file type');
//     error.status = 400;
//     return cb(error, false);
//   }
//   cb(null, true);
// };

// const upload = multer({
//   storage,
//   fileFilter,
// });

// export default upload;
