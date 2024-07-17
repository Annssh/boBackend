// Update the bucket name with your own bucket name
// const multer = require("multer");
// const AWS = require('aws-sdk');


// const uploadMulter = multer({
//   storage: multer.diskStorage({}), // Optional: temporary storage before upload to S3
//   fileFilter: (req, file, cb) => {
//     // Validate file type (optional)
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new multer.MulterError('Only image files are allowed!'), false);
//     }
//   },
// });


// // const S3 = AWS.S3({
// //   region: "ap-south-1",
// //   credentials: {
// //     accessKeyId: "AKIAZGLQTJWQLSI73N7V",
// //     secretAccessKey: "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",
// //   },
// // });

// const upload = (fileName, buffer, mimeType) => {
//   return new S3.upload({
//     Bucket: "mecuel-prod", // Update with your bucket name
//     Key: fileName,
//     Body: buffer,
//     ContentType: mimeType,
//   });
// };

// const S3FileUloadUrl = `https://mecuel-prod.s3.ap-south-1.amazonaws.com/`; // Update with your bucket name

// module.exports = { S3, upload, S3FileUloadUrl, uploadMulter };


const IMAGE_MAX_SIZE = 50 * 1024 * 1024; // 50 MB
const VIDEO_MAX_SIZE = 100 * 1024 * 1024; // 100 MB

const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|mp4|mkv|avi/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
})

module.exports={upload};




// const { S3Client } = require('@aws-sdk/client-s3')
// const multer = require('multer')
// const multerS3 = require('multer-s3')
// const { v4: uuidv4 } = require('uuid');

// const s3 = new S3Client(
//   {
//     region: "ap-south-1",
//     credentials: {
//       accessKeyId: "AKIAZGLQTJWQLSI73N7V",
//       secretAccessKey: "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"
//     }
//   }
// )

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'mecuel-prod',
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     // metadata: function (req, file, cb) {
//     //   cb(null, { fieldName: file.fieldname });
//     // },
//     key: function (req, file, cb) {
//       cb(null, uuidv4() + "." + file.originalname.split(".")[file.originalname.split(".").length - 1]);
//     }
//   })
// })

// const S3FileUloadUrl = `https://mecuel-prod.s3.ap-south-1.amazonaws.com/`; // Update with your bucket name

// module.exports = { upload, S3FileUloadUrl }