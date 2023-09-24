const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');

router.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    const posts = await Post.find({ author: userId });

    res.json({ user, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching user data' });
  }
});

router.get('/search/all', async (req, res) => {
  try {
    const query = req.query.q; 
    if (!query) {
      return res.status(400).json({ error: 'Search query is missing.' });
    }

    const userResults = await User.find({ username: { $regex: new RegExp(query, 'i') } });
    const postResults = await Post.find({ title: { $regex: new RegExp(query, 'i') } });

    const results = {
      users: userResults,
      posts: postResults,
    };

    if (userResults.length === 0 && postResults.length === 0) {
      return res.status(404).json({ error: 'No results founded.' });
    }

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while searching.' });
  }
});


module.exports = router;
