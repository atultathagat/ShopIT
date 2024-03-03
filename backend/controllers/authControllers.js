import * as crypto from 'crypto';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import userModel from '../models/userModel.js';
import User from '../models/userModel.js';
import getResetPasswordTemplate from '../utils/emailTemplates.js';
import ErrorHandler from '../utils/errorHandler.js';
import sendEmail from '../utils/sendEmail.js';
import sendToken from '../utils/sendToken.js';
import { delete_file, upload_file } from '../utils/cloudinary.js';

// Register user => /api/v1/register
export default catchAsyncErrors(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password
  });
  sendToken(user, 201, res);
});

// Upload user avatar => /api/v1/me/upload_avatar
export const uploadAvatar = catchAsyncErrors(async (req, res) => {
  if(req?.user?.avatar?.url) {
    await delete_file(req?.user?.avatar?.public_id)
  }
  const avatar = await upload_file(req.body.avatar, 'shopit/avatars')
  const user = await userModel.findByIdAndUpdate(req?.user?._id, {avatar})
  return res.status(200).json(user);
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
    httpOnly: true
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
      message
    });
    return res.status(200).json({
      message: `Email sent to the user ${user.email}`
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

// Get current user profile => /api/v1/me
export const getUserProfile = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req?.user?._id);
  res.status(200).json({ user });
});

// Update password => /api/v1/password/update
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req?.user?._id).select('+password');
  const isPasswordMatched = await user.checkPassword(req?.body?.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler('Old password is incorrrect', 400));
  }
  user.password = req?.body?.password;
  await user.save();
  return res.status(200).json({ success: true });
});

// Update current user profile => /api/v1/me/update
export const updateUserProfile = catchAsyncErrors(async (req, res) => {
  const newUserData = {
    name: req?.body?.name,
    email: req?.body?.email
  };
  const user = await userModel.findByIdAndUpdate(req?.user?._id, newUserData, { new: true });
  res.status(200).json({ user });
});

// Get all users : ADMIN => /api/v1/admin/users
export const getAllUsers = catchAsyncErrors(async (req, res) => {
  const users = await userModel.find();
  res.status(200).json({ users });
});

// Get user details : ADMIN => /api/v1/admin/user/:id
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const errorHandlerObj = new ErrorHandler(`User not found with the id: ${req?.params?.id}`, 404);
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return next(errorHandlerObj);
    }
    return res.status(200).json({ user });
  } catch {
    return next(errorHandlerObj);
  }
});

// Update user profile :  ADMIN => /api/v1/v1/admin/user/:id
export const updateUserProfileByAdmin = catchAsyncErrors(async (req, res) => {
  const newUserData = {
    name: req?.body?.name,
    email: req?.body?.email,
    role: req?.body?.role
  };
  const user = await userModel.findByIdAndUpdate(req?.params?.id, newUserData, { new: true });
  res.status(200).json({ user });
});

// Delete user profile : ADMIN => /api/v1/v1/admin/user/:id
export const deleteUserProfileByAdmin = catchAsyncErrors(async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    // TODO: Remove avatar from cloudinary
    await user.deleteOne();
    return res.status(200).json({ success: true });
  } catch {
    return next(new ErrorHandler(`User not found with the id: ${req?.params?.id}`, 404));
  }
});
