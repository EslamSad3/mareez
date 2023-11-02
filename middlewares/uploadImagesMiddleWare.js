const multer = require("multer");
const ApiError = require("../utils/apiError");

let options = (folderName) => {
  const storage = multer.diskStorage({
  });
  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images allowed", 400), false);
    }
  }
  const upload = multer({ storage, fileFilter });
  return upload;
};

exports.uploadSingleFile = (fieldName, folderName) =>
  options(folderName).single(fieldName);

exports.uploadMixOfFiles = (arrayOfFields, folderName) =>
  options(folderName).fields(arrayOfFields);
