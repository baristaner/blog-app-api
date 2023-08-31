const express = require('express');
const basicAuth = require('express-basic-auth');
const router = express.Router();
const Post = require('../models/Post'); // load post model

// Admin giriş sayfasını göster
router.get('/admin', (req, res) => {
    res.render('admin-login'); // admin-login.ejs
});

router.post('/admin/addpost', async (req, res) => {
    try {
        const { title, content } = req.body;
        const newPost = new Post({
            title,
            content
        });
        await newPost.save();
        res.redirect('/admin/dashboard'); // redirect to admin dashboard
    } catch (error) {
        console.error(error);
        res.render('error'); 
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
    try {
        const { title, content } = req.body;
        await Post.findByIdAndUpdate(req.params.id, {
            title,
            content
        });
        res.redirect('/admin/dashboard'); // Admin paneline yönlendir
    } catch (error) {
        console.error(error);
        res.render('error'); // Hata görünümünü yükler
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
