const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeauters');

exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }
    const collection = await query;
    if (!collection) {
      return next(new ApiError(`No brand For This id ${id}`, 404));
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
    const collection = await Model.create(req.body);
    res.status(201).json({ data: collection });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const collection = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!collection) {
      return next(
        new ApiError(`No collection For This id ${req.params.id}`, 404)
      );
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

// .populate([
//   { path: 'category', select: 'name' },
//   { path: 'subcategory', select: 'name' },
//   { path: 'brand', select: 'name' },
// ]);
