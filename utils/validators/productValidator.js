const { check } = require("express-validator");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("Too Short Product Name")
    .notEmpty()
    .withMessage("Product title Required"),
  check("description")
    .notEmpty()
    .withMessage("Product Description is required")
    .isLength({ max: 3000 })
    .withMessage("Product Description is too long"),
  check("quantity")
    .notEmpty()
    .withMessage("product quantity is required")
    .isNumeric()
    .withMessage("product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("product sold quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("product price is required ")
    .isNumeric()
    .withMessage("product price must be a number")
    .isLength({ max: 32 }),
  check("priceAfterDisc")
    .optional()
    .isNumeric()
    .withMessage("price after discount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error("price after discount must be less than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("colors must be an array of strings"),
  check("imageCover").notEmpty().withMessage("image Cover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("colors must be an array of strings"),
  check("category")
    .notEmpty()
    .withMessage("products must belong to a category")
    .isMongoId()
    .withMessage("invalid category id format"),
  check("brand").optional().isMongoId().withMessage("invalid brand id format"),
  check("subcategory")
    .optional()
    .isMongoId()
    .withMessage("invalid subcategory id format"),
  check("rating")
    .optional()
    .isNumeric()
    .withMessage("rating must be a number")
    .isLength({ min: 1, max: 5 })
    .withMessage("rating must be between 1 and 5"),
  check("rates").optional().isNumeric().withMessage("rating must be a number"),
  validatorMiddleWare,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID Formate"),
  validatorMiddleWare,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID Formate"),
  validatorMiddleWare,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID Formate"),
  validatorMiddleWare,
];
