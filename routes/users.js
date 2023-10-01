const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

router.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await Post.find({ author: userId });

    res.json({ user, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching user data' });
  }
});

router.post('/follow', async (req, res) => {
    const { userId,user_id_followed } = req.query; 

    try {
        const user = await User.findById(userId)

        const followedUser = await User.findById(user_id_followed)
        if (!followedUser) {
            return res.status(404).json({ error: 'Followed user not found' });
        }

        if (!user.following.includes(user_id_followed)) {
            user.following.push(user_id_followed); 
        } else {
            return res.status(400).json({ error: 'User is already following this user' });
        }

        followedUser.followers.push(userId);

        await user.save();
        await followedUser.save();

        res.json({ message: 'User followed successfully' });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/unfollow', async (req, res) => {
    const { userId, user_id_unfollowed } = req.query;

    try {
        const user = await User.findById(userId);
        console.log("User:", user);

        const unfollowedUser = await User.findById(user_id_unfollowed);
        console.log("Unfollowed User:", unfollowedUser);

        if (!unfollowedUser) {
            return res.status(404).json({ error: 'Unfollowed user not found' });
        }

        const index = user.following.indexOf(user_id_unfollowed);
        if (index !== -1) {
            user.following.splice(index, 1); 
        } else {
            return res.status(400).json({ error: 'User is not following this user' });
        }

        const followerIndex = unfollowedUser.followers.indexOf(userId);
        if (followerIndex !== -1) {
            unfollowedUser.followers.splice(followerIndex, 1);
        }

        await user.save();
        await unfollowedUser.save();

        res.json({ message: 'User unfollowed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
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
