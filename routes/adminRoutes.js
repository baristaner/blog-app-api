const dotenv = require('dotenv');
dotenv.config(); 

const express = require('express');
const basicAuth = require('express-basic-auth');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Post = require('../models/Post'); // load post model

const multer = require('multer');

const sessionSecret = process.env.SESSION_SECRET;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});

const upload = multer({ storage: storage });

router.get('/admin', (req, res) => {
    res.render('admin-login'); // admin-login.ejs
});

// Middleware: Token auth 
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  jwt.verify(token, sessionSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    req.userId = decoded.userId;
    next();
  });
};

router.post('/admin/addpost', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { title, content,author } = req.body;
        
        let imagePath = null;
        if (req.file) {
            imagePath = req.file.path;
        }
        
        const newPost = new Post({
            title,
            content,
            imagePath,
            author 
        });
        await newPost.save();
        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/updatepost',authenticateToken, async (req, res) => {
    try {
        const { id,title,content } = req.query; 
        await Post.findByIdAndUpdate(id, {
            title,
            content
        });
        res.json({ id,title,content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Sunucu hatası: Gönderi güncellenemedi.' });
    }
});

router.delete('/admin/deletepost/:id', authenticateToken,async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        console.log("Post Deleted successfully");
    } catch (error) {
        console.error(error);
        res.render('error'); 
    }
});

router.get('/admin/edit/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        res.json(post); // JSON verisi olarak post verisini iletilir
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Sunucu hatası: Gönderi düzenlenemedi.' });
    }
});

module.exports = router;
