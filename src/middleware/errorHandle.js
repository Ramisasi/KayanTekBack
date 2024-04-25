// class to extend from belting nodejs error class and access all error in application
export class apiError extends Error {
  constructor(errorMessage, statusCode) {
    super(errorMessage);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
    this.isOperational = true;
  }
}
// function to handle all application error
export const asyncHandle = (fn) => {
  return (req, res, nex) => {
    fn(req, res, nex).catch((err) => nex(new apiError("catch error", 400)));
  };
};
// function gelable Error for send all application error to font end
export const gelableError = (err, req, res, next) => {
  if (err) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.mood == "dev") {
      res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
      });
    } else {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
  }
};
