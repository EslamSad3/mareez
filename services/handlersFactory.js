const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeauters');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_MAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.cloudinaryImageUploadMethod = async (file) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(file, (err, res) => {
      console.log(err, 'err 15');
      if (err) return res.status(500).send('upload image error');
      resolve({
        res: res.secure_url,
      });
    });
  });
};

exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }
    const collection = await query;
    if (!collection) {
      return next(new ApiError(`No collection For This id ${id}`, 404));
    }
    res.status(200).json({ data: collection });
  });

exports.getAll = (Model, modelname = '') =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const countDocuments = await Model.countDocuments();
    const apiFeauters = new ApiFeatures(Model.find(filter), req.query)
      .pagination(countDocuments)
      .filter()
      .search(modelname)
      .limitFields()
      .sort();
    // Excute query
    const { mongooseQuery, paginateResult } = apiFeauters;
    const collection = await mongooseQuery;
    res
      .status(200)
      .json({ results: collection.length, paginateResult, data: collection });
  });

exports.create = (Model) =>
  asyncHandler(async (req, res) => {
    if (req.file || req.files) {
      const urlsOfImages = [];
      if (req.files.images) {
        const filesImages = req.files.images;
        for (const file of filesImages) {
          const { path } = file;
          const newPath = await this.cloudinaryImageUploadMethod(path);
          urlsOfImages.push(newPath);
        }
      }
      const urlsOfImageCover = [];
      if (req.files.imageCover) {
        const files = req.files.imageCover;
        for (const file of files) {
          const { path } = file;
          const newPath = await this.cloudinaryImageUploadMethod(path);
          urlsOfImageCover.push(newPath);
        }
      }
      
      const urlsOfimage = [];
      if (req.files.image) {
        const files = req.files.image;
        for (const file of files) {
          const { path } = file;
          const newPath = await this.cloudinaryImageUploadMethod(path);
          urlsOfimage.push(newPath);
        }
        req.body.image = urlsOfimage[0]?.res || " ";
      }

      if (urlsOfImages) {
        req.body.images = urlsOfImages.map((url) => url.res);
      }
      if (urlsOfImageCover) {
        req.body.imageCover = urlsOfImageCover[0]?.res;
      }
      if (urlsOfimage) {
        req.body.image = urlsOfimage[0]?.res;
      }
    }

    if (req.body.colors) {
      const colors = req.body.colors;
      const newColors = colors.split(',');
      req.body.colors = newColors;
      console.log(req.body.colors, 'newColors');
    }

    if (req.body.sizes) {
      const sizes = req.body.sizes;
      const newsizes = sizes.split(',');
      console.log(newsizes, 'Sizes');
      req.body.sizes = newsizes;
    }

    const collection = await Model.create(req.body);
    res.status(201).json({ data: collection });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    if (req.file || req.files) {
      const urlsOfImages = [];
      if (req.files.images) {
        const filesImages = req.files.images;
        for (const file of filesImages) {
          const { path } = file;
          const newPath = await this.cloudinaryImageUploadMethod(path);
          urlsOfImages.push(newPath);
        }
      }
      const urlsOfImageCover = [];
      if (req.files.imageCover) {
        const files = req.files.imageCover;
        for (const file of files) {
          const { path } = file;
          const newPath = await this.cloudinaryImageUploadMethod(path);
          urlsOfImageCover.push(newPath);
        }
      }

      if (urlsOfImages) {
        req.body.images = urlsOfImages.map((url) => url.res);
      }
      if (urlsOfImageCover) {
        req.body.imageCover = urlsOfImageCover[0]?.res;
      }
    }
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    await document.save();
    res.status(200).json({ data: document });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const collection = await Model.findByIdAndDelete(id);
    if (!collection) {
      return next(new ApiError(`No collection For This id ${id}`, 404));
    }
    res.status(204).send();
  });
