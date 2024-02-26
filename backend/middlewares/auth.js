import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import ErrorHandler from '../utils/errorHandler.js';
import catchAsyncErrors from './catchAsyncErrors.js';

export default catchAsyncErrors(async (req, res, next) => {
  let token = req.cookies.token;
  if(!token) {
    token = req.headers.token;
  }
  if (!token) {
    return next(new ErrorHandler('Login first to access this resource', 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await userModel.findById(decoded.id);
  req.user = user;
  return next();
});

// Authorize user roles
export const authorizeRoles = roles => async (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403));
  }
  return next();
};
