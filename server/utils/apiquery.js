// This is because the methods like .find(), .sort(), .skip(), and .limit() are chainable query methods from the Mongoose library (assuming you're using MongoDB and Mongoose).

// These methods are designed to be lazy-loaded—meaning, the query isn't executed until you explicitly call .exec() or await the final result. When you're chaining these methods, they don't execute the query immediately, so you don't need async/await within APIFeatures. The final query execution will happen when you call await features.query in the controller.

class Apiquery {
  constructor(models, queryobj) {
    this.models = models;
    this.queryobj = queryobj;
  }
  async filter() {
    let queryobj = { ...this.queryobj };
    const excludedFields = ['page', 'limit'];
    excludedFields.forEach((el) => delete queryobj[el]);
    this.models = await this.models.find(queryobj);
    return this;
  }

  paginate() {
    const page = this.queryobj.page * 1 || 1;
    const limit = this.queryobj.limit * 1 || 20;
    const skip = (page - 1) * limit;

    this.models = this.models.skip(skip).limit(limit);

    return this;
  }
}
export default Apiquery;
