class ApiError extends Error {
  constructor(message, statuscode) {
    super(message);
    this.statuscode = statuscode;
    this.status = `${this.statuscode}`.startsWith('4') ? 'fail' : 'error';
    this.isoperational = true;
    //the stack trace will exclude the stack frames from the constructor, resulting in a more focused and cleaner trace: and this referv to the instance of error
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
