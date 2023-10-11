const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

router.get('/uploads/:imagePath', imageController.getImage);

module.exports = router;
