const multer = require('multer');
const ApiError = require('../utils/apiError');

const multerOptions = () => {
  const storage = multer.memoryStorage();
  const multerFIlter = function (req, file, cb) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new ApiError('Only Images Allowed', 400), false);
    }
  };
  const upload = multer({ storage: storage, fileFilter: multerFIlter });
  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMultipleImages = (arrOfFields) =>
  multerOptions().fields(arrOfFields);
