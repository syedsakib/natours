const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

//Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updatemypassword', authController.updatePassword);

router.get('/getme', userController.getMe, userController.getUser);

router.patch(
  '/updateme',
  userController.uploadPhoto,
  userController.resizePhoto,
  userController.updateMe
);
router.delete('/deleteme', userController.deleteMe);

//Protect all routes after this middleware
router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
