exports.createCategoryFilterObj = (req, res, next) => {
  if (req.params.categoryid) {
    const filterObj = req.params.categoryid
      ? { category: req.params.categoryid }
      : {};
    req.filterObj = filterObj;
  }
  next();
};

exports.createSubCategoryFilterObj = (req, res, next) => {
  if (req.params.subcategoryid) {
    const filterObj = req.params.subcategoryid
      ? { subcategory: req.params.subcategoryid }
      : {};
    req.filterObj = filterObj;
  }
  next();
};
exports.createbrandFilterObj = (req, res, next) => {
  if (req.params.brandid) {
    const filterObj = req.params.brandid ? { brand: req.params.brandid } : {};
    req.filterObj = filterObj;
  }
  next();
};
