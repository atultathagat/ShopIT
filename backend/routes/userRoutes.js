import express from 'express';
import createUser, {
  forgotPassword, loginUser, logoutUser, resetPassword,
} from '../controllers/authControllers.js';

const router = express.Router();

router.route('/register').post(createUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forget').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

export default router;
