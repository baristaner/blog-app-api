const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/signup', upload.single('profilePicture'), authController.signUp);
router.post('/login', authController.login);
router.post('/protected', authController.protectedRoute);

module.exports = router;
