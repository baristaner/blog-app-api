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

// Like Post
router.post('/likepost', async (req, res) => {
    const { author, postId } = req.query; 

    if (!author || !postId) {
    return res.status(400).json({ error: 'Author and postId must be provided' });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.likes.includes(author)) {
            return res.status(400).json({ error: 'You already liked this post' });
        }

        post.likes.push(author);

        await post.save();

        res.json({ message: 'Post liked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Save Post
router.post('/savepost', async (req, res) => {
    const { author, postId } = req.query; 

    if (!author || !postId) {
    return res.status(400).json({ error: 'Author and postId must be provided' });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.savedBy.includes(author)) {
            return res.status(400).json({ error: 'You already saved this post' });
        }

        const isSaved = post.savedBy.includes(author);

        if (isSaved) {
            post.savedBy.pull(author);
        } else {
            post.savedBy.push(author);
        }

        await post.save();

        res.json({ message: 'Post saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add Comment to Post
router.post('/commentpost', async (req, res) => {
    const { author, postId,text } = req.query; 

     if (!author || !postId || !text ) {
    return res.status(400).json({ error: 'Author and postId,text must be provided' });
    }
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const newComment = {
            text,
            author: author,
        };

        post.comments.push(newComment);

        await post.save();

        res.json({ message: 'Comment added successfully', comment: newComment });
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
