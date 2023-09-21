const express = require('express');
const basicAuth = require('express-basic-auth');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Post = require('../models/Post'); // load post model

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Dosyanın kaydedileceği klasör
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Dosyanın adı
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

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    req.userId = decoded.userId;
    next();
  });
};

router.post('/admin/addpost', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        
        let imagePath = null;
        if (req.file) {
            imagePath = req.file.path;
        }
        
        const newPost = new Post({
            title,
            content,
            imagePath 
        });
        await newPost.save();
        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/admin/dashboard', async (req, res) => {
    try {
        const posts = await Post.find(); // get all posts
        res.render('admin-dashboard', { posts: posts });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred.');
    }
});

router.post('/admin/updatepost/:id', async (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  try {
    // Gönderiyi bul ve güncelle
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content },
      { new: true } // Güncellenmiş gönderiyi almak için { new: true } seçeneğini kullanın
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Gönderi bulunamadı.' });
    }

    // Başarı durumunda güncellenmiş gönderiyi yanıt olarak gönderin
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sunucu hatası: Gönderi güncellenemedi.' });
  }
});

router.put('/admin/editpost/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
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

router.delete('/admin/deletepost/:id', authenticateToken,async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        console.log("Post Deleted successfully");
    } catch (error) {
        console.error(error);
        res.render('error'); // Hata görünümünü yükler
    }
});

module.exports = router;
