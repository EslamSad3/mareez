const { check } = require("express-validator");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID Formate"),
  validatorMiddleWare,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand Required")
    .isLength({ min: 2 })
    .withMessage("Too Short Name")
    .isLength({ max: 20 })
    .withMessage("Too Long Name"),
  validatorMiddleWare,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID Formate"),
  check("name")
    .notEmpty()
    .withMessage("Brand Required")
    .isLength({ min: 2 })
    .withMessage("Too Short Name")
    .isLength({ max: 20 })
    .withMessage("Too Long Name"),
  validatorMiddleWare,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID Formate"),
  validatorMiddleWare,
];
