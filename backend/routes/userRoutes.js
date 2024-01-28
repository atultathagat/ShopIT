import express from 'express';
import createUser, {
  deleteUserProfileByAdmin,
  forgotPassword, getAllUsers, getUserDetails, getUserProfile, loginUser, logoutUser, resetPassword, updatePassword, updateUserProfile, updateUserProfileByAdmin,
} from '../controllers/authControllers.js';
import isUserAuthenticated, { authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

router.route('/register').post(createUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forget').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(isUserAuthenticated, getUserProfile);
router.route('/password/update').put(isUserAuthenticated, updatePassword);
router.route('/me/update').put(isUserAuthenticated, updateUserProfile);
router.route('/admin/users').get(isUserAuthenticated, authorizeRoles(['admin']), getAllUsers);
router.route('/admin/user/:id').get(isUserAuthenticated, authorizeRoles(['admin']), getUserDetails)
  .put(isUserAuthenticated, authorizeRoles(['admin']), updateUserProfileByAdmin)
  .delete(isUserAuthenticated, authorizeRoles(['admin']), deleteUserProfileByAdmin);
export default router;
