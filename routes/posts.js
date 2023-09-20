const express = require('express');
const router = express.Router();
const path = require('path');
const Post = require('../models/Post'); 

// GET All Posts as JSON
router.get('/posts/all', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get Post By ID
router.get('/posts/:postId', async (req, res) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get the Image path 
router.get('/uploads/:imagePath', (req, res) => {
  const imagePath = req.params.imagePath;
  const imageFilePath = path.join(__dirname, '../uploads', imagePath);

  
  res.sendFile(imageFilePath);
});




module.exports = router;
