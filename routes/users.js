const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/users/:userId', userController.getUserData);
router.post('/follow', userController.followUser);
router.post('/unfollow', userController.unfollowUser);
router.get('/search/all', userController.searchAll);
router.get('/users/:authorId/posts', userController.getUserPosts);

module.exports = router;
