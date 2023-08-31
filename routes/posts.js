const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); 

// GET Posts as JSON
router.get('/posts/json', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
