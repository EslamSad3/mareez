const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeauters');

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const collection = await Model.findById(id);
    if (!collection) {
      return next(new ApiError(`No brand For This id ${id}`, 404));
    }
    res.status(200).json({ data: collection });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    // Build query
    const countDocuments = await Model.countDocuments();
    const apiFeauters = new ApiFeatures(Model.find(), req.query)
      .pagination(countDocuments)
      .filter()
      .search()
      .limitFields()
      .sort();
    // Excute query
    const { mongooseQuery, paginateResult } = apiFeauters;
    const collection = await mongooseQuery;
    res
      .status(200)
      .json({ results: collection.length, paginateResult, data: collection });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const collection = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!collection) {
      return next(new ApiError(`No {collection} For This id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: collection });
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
