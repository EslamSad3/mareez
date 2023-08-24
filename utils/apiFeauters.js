class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryStringObj = { ...this.queryString };
    const excludedFileds = [
      'page',
      'limit',
      'skip',
      'fields',
      'sort',
      'search',
    ];
    excludedFileds.forEach((filed) => {
      delete queryStringObj[filed];
    });
    // Apply Filteration
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fieldsBy = this.queryString.fields.split(',').join(' ');
      console.log(fieldsBy);
      this.mongooseQuery = this.mongooseQuery.select(fieldsBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v');
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.search) {
      const query = {};
      if (modelName === 'Product') {
        query.$or = [
          {
            title: {
              $regex: this.queryString.search,
              $options: 'i',
            },
          },
          {
            description: {
              $regex: this.queryString.search,
              $options: 'i',
            },
          },
        ];
      } else {
        query.$or = [
          { name: { $regex: this.queryString.search, $options: 'i' } },
        ];
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  pagination(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 30;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    const paginate = {};
    paginate.currentPage = page;
    paginate.limit = limit;
    paginate.numberOfPages = Math.ceil(countDocuments / limit);

    // next page
    if (endIndex < countDocuments) {
      paginate.next = page + 1;
    }
    // prev page
    if (skip > 0) {
      paginate.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.paginateResult = paginate;
    return this;
  }
}

module.exports = ApiFeatures;
