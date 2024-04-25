class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }
  paginate() {
    let page = this.queryString.page * 1 || 1;
    if (page < 1) page = 1;
    let limit = 5;
    let skip = (page - 1) * limit;
    this.mongooseQuery.skip(skip).limit(limit);
    this.page = page;
    return this;
  }

  filter() {
    let queryString = { ...this.queryString };
    let excludedParams = ["page", "sort", "keyword", "limit"];
    excludedParams.forEach((elm) => {
      delete queryString[elm];
    });
    queryString = JSON.stringify(queryString);
    queryString = queryString.replace(
      /(gte|gt|lte|lt)/g,
      (match) => `$${match}`
    );
    queryString = JSON.parse(queryString);
    this.mongooseQuery.find(queryString);
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      this.mongooseQuery.sort(this.queryString.sort);
    }
    return this;
  }
  search() {
    this.mongooseQuery.find({
      isLogin: true,
    });
    return this;
  }
  fields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.replace(/(,)/g, " ");
      this.mongooseQuery.select(fields);
    }
    return this;
  }
  populate(path, select) {
    this.mongooseQuery.populate({
      path,
      select,
    });
    return this;
  }
  count() {
    this.mongooseQuery.count();
    return this;
  }
}

export default ApiFeatures;
