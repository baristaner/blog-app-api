const express = require('express');
const router = express.Router();
const path = require('path');
const Post = require('../models/Post'); 
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

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

        const authorObjectId = new mongoose.Types.ObjectId(author);

        const likeIndex = post.likes.indexOf(authorObjectId);

        if (likeIndex !== -1) {
            post.likes.splice(likeIndex, 1);

            await post.save();
            return res.json({ message: 'Post unliked successfully' });
        }

        // Kullanıcı beğeni yapmamışsa, beğeni ekleyin
        post.likes.push(authorObjectId);
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

        const isSaved = post.savedBy.includes(author);

        if (isSaved) {
            post.savedBy.pull(author); // Kullanıcıyı listeden çıkar
        } else {
            post.savedBy.push(author); // Kullanıcıyı listeye ekle
        }

        await post.save();

        res.json({ message: isSaved ? 'Post unsaved successfully' : 'Post saved successfully' });
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

// Get Post By User
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
