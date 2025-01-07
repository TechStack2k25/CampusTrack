const senddeverror = (error, req, res) => {
  return res.status(error.statuscode).json({
    status: error.status,
    message: error.message,
    error: error,
    stack: error.stack,
  });
};

export const globalerrorhandler = (error, req, res, next) => {
  console.log(error.stack);

  error.statuscode = error.statuscode || 500;
  error.status = error.status || 'error';
  senddeverror(error, req, res);
};

export default globalerrorhandler;
