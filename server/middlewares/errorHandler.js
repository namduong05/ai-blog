const errorHandler = (err, req, res, next) => {
  const code = res.code || 500;
  const message = err.message || "Internal Server Error";
  res.status(code).json({
    code,
    status: false,
    message,
    stack: err.stack,
  });
};

export default errorHandler;
