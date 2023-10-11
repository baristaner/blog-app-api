const express = require('express');
const router = express.Router();
const multer = require('multer');
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// POST route to create a new post
router.post('/addpost', authMiddleware.authenticateToken,upload.single('image'), postController.addPost);

// PUT route to update an existing post
router.put('/updatepost', authMiddleware.authenticateToken, postController.updatePost);

// DELETE route to delete a post by ID
router.delete('/deletepost/:id',authMiddleware.authenticateToken,postController.deletePost);

// GET route to get all posts
router.get('/posts/all', postController.getAllPosts);

// POST route to like a post
router.post('/likepost', postController.likePost);

// POST route to save/unsave a post
router.post('/savepost', postController.savePost);

// POST route to add a comment to a post
router.post('/commentpost', postController.commentPost);

// GET route to get a post by ID
router.get('/posts/:postId', postController.getPostById);


module.exports = router;
