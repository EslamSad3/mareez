const Product = require('../models/productModel');
const factory = require('./handlersFactory');
const { uploadMixOfFiles,
} = require('../middlewares/uploadImagesMiddleWare');
const expressAsyncHandler = require('express-async-handler');
// upload images

exports.uploadProductImages = uploadMixOfFiles(
  [
    {
      name: 'imageCover',
      maxCount: 1,
    },
    { name: 'images', maxCount: 4 },
  ]
);



// @desc      Create product
// @route     POST /api/products
// @access    private
exports.createProduct = factory.create(Product);

// @desc      Get Specific product by id
// @route     GET /api/products/:id
// @access    Public
exports.getProduct = factory.getOne(Product, [
  { path: 'category', select: 'name' },
  { path: 'subcategory', select: 'name' },
  { path: 'brand', select: 'name' },
  { path: 'reviews' },
]);

// @desc      Get List Of products
// @route     GET /api/products
// @access    Public
exports.getProducts = factory.getAll(Product, 'Product');

// @desc      Update product
// @route     PATCH /api/products/:id
// @access    private
exports.updateProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  console.log(req.files.images);
  if (req.files.images) {
    const urlsOfImages = [];
    const filesImages = req.files.images;
    for (const file of filesImages) {
      const { path } = file;
      const newPath = await factory.cloudinaryImageUploadMethod(path);
      urlsOfImages.push(newPath);
    }
    req.body.images = urlsOfImages.map((url) => url.res);
  }

  if (req.files.image) {
    const urlsOfimage = [];
    const files = req.files.image;
    for (const file of files) {
      const { path } = file;
      const newPath = await factory.cloudinaryImageUploadMethod(path);
      urlsOfimage.push(newPath);
    }
    req.body.image = urlsOfimage[0]?.res || " ";
  }
  if (req.files.imageCover) {
    const urlsOfImageCover = [];
    const files = req.files.imageCover;
    for (const file of files) {
      const { path } = file;
      const newPath = await factory.cloudinaryImageUploadMethod(path);
      urlsOfImageCover.push(newPath);
    }
    req.body.imageCover = urlsOfImageCover[0]?.res || " ";
  }

  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }

  if (req.body.colors) {
    const colors = req.body.colors;
    console.log(colors)
    const newColors = colors.split(',');
    req.body.colors = newColors;
  }
  if (req.body.sizes) {
    const sizes = req.body.sizes;
    const newsizes = sizes.split(',');
    console.log(newsizes, 'Sizes');
    req.body.sizes = newsizes;
  }

  let product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  !product && next(new ApiError("Product not found", 400));
  product && res.status(200).json({ data: product });
});

// @desc      Delete product
// @route     DELETE /api/products/:id
// @access    private
exports.deleteProduct = factory.deleteOne(Product);

// .populate([
//   { path: 'category', select: 'name' },
//   { path: 'subcategory', select: 'name' },
//   { path: 'brand', select: 'name' },
// ]);

exports.averageRatings = Product.aggregate([
  { $match: { reviews: [] } },
  { $group: { _id: '__id', total: { $sum: '$rating' } } },
]);
