import ErrorHandler from '../utils/errorHandler.js';

export default (err, req, res, next) => {
  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || 'Internal Server Error'
  };
  if (err?.name === 'CastError') {
    const message = `Resource Not Found. Invalid: ${err?.path}`;
    error = new ErrorHandler(message, 404);
  } else if (err?.name === 'ValidatorError') {
    const message = Object.values(error.errors).map(value => value.message);
    error = new ErrorHandler(message, 400);
  }
  // Handle Mongoose duplicate error key
  if (err?.code === 11000) {
    const message = `Duplicate ${Object.keys(err?.keyValue)} entered.`;
    error = new ErrorHandler(message, 404);
  }
  // Handle wrong JWT error
  if (err?.name === 'JsonWebTokenError') {
    const message = 'Json Web Token is invalid. Please try again!!!';
    error = new ErrorHandler(message, 400);
  }
  // Handle expired JWT error
  if (err?.name === 'TokenExpiredError') {
    const message = 'Json Web Token is expired. Please try again!!!';
    error = new ErrorHandler(message, 400);
  }
  res.status(error.statusCode).json({
    message: error.message,
    ...(process.env.NODE_ENV === 'DEVELOPMENT' ? { error: err } : {})
  });
};
