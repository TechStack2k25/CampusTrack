class Apiquery {
  constructor(models, queryobj) {
    this.models = models;
    this.queryobj = queryobj;
  }
  filter() {
    this.models = this.models.find(this.queryobj);
    return this.models;
  }
}
export default Apiquery;
