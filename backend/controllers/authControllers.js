import * as crypto from 'crypto';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import userModel from '../models/userModel.js';
import User from '../models/userModel.js';
import getResetPasswordTemplate from '../utils/emailTemplates.js';
import ErrorHandler from '../utils/errorHandler.js';
import sendEmail from '../utils/sendEmail.js';
import sendToken from '../utils/sendToken.js';

// Register user => /api/v1/register
export default catchAsyncErrors(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });
  sendToken(user, 201, res);
});

// Login user => /api/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler('Please enter email and password', 400));
  }

  // Find user in database
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorHandler('Please enter valid email id', 401));
  }
  // check password is correct
  const isPasswordMatched = await user.checkPassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid Password', 401));
  }
  sendToken(user, 201, res);
});

// Logout user =>/api/v1/logout
export const logoutUser = async (req, res) => {
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
  };
  res.cookie('token', null, options);
  res.status(200).json({ message: 'Logged out' });
};

// Forgot password => /api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // Find user in database
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler('User not found with the email id', 404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save();
  const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;
  const message = getResetPasswordTemplate(user, resetUrl);
  try {
    await sendEmail({
      email: user?.email,
      subject: 'ShopIT Password Recovery',
      message,
    });
    return res.status(200).json({
      message: `Email sent to the user ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    return next(new ErrorHandler(error?.message, 500));
  }
});

// Forgot password => /api/v1/password/reset:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash the URL token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await userModel.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
  if (!user) {
    return next(new ErrorHandler('Password reset token is invalid or the user has been expired'));
  }
  if (req.body.password !== req.body.confirmedPassword) {
    return next(new ErrorHandler('Confirm password and password entered does not match'));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});
