const express = require('express');
const basicAuth = require('express-basic-auth');
const router = express.Router();
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

router.post('/admin/addpost', upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const imagePath = req.file.path; // Dosya yolu
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


router.get('/admin/edit/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        res.render('edit', { post }); // edit.ejs görünümünü yükler ve post verisini iletilir
    } catch (error) {
        console.error(error);
        res.render('error'); // Hata görünümünü yükler
    }
});

router.delete('/admin/deletepost/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.redirect('/admin/dashboard'); // Admin paneline yönlendir
    } catch (error) {
        console.error(error);
        res.render('error'); // Hata görünümünü yükler
    }
});

module.exports = router;
