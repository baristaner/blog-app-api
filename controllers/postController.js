const postService = require('../services/postService');
const mongoose = require('mongoose');

async function addPost(req, res) {
  const { title, content, author } = req.body;
  let imagePath = null;

  if (req.file) {
    imagePath = req.file.path;
  }

  try {
    const newPost = await postService.addPost(title, content, author, imagePath); // Calls the service function
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error('Error in addPostController:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updatePost(req, res) {
  const { id, title, content } = req.query;
  const userId = req.userId;

  try {
    const updatedPost = await postService.updatePost(id, userId, title, content);
    res.json(updatedPost);
  } catch (error) {
    console.error('Error in updatePost:', error);
    if (error.message === 'Post not found') {
      res.status(404).json({ error: 'Post not found' });
    } else if (error.message === 'Unauthorized to update this post') {
      res.status(403).json({ error: 'You are not authorized to update this post' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

async function deletePost(req, res) {
  const postId = req.params.id;
  const userId = req.userId;

  try {
    const deleted = await postService.deletePost(postId, userId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error in deletePost:', error);
    if (error.message === 'Unauthorized to delete this post') {
      res.status(401).json({ error: 'Unauthorized to delete this post' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}


async function getAllPosts(req, res) {
  try {
    const posts = await postService.getAllPosts();
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}

async function likePost(req, res) {
  const { author, postId } = req.query;
  try {
    const message = await postService.likePost(author,postId);
    res.json({ message });
  } catch (error) {
    console.error('Error in likePost:', error); // Log the error
    if (error.message === 'Post not found') {
      res.status(404).json({ error: 'Post not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

async function savePost(req, res) {
  const { author, postId } = req.query;
  try {
    const message = await postService.savePost(author,postId);
    res.json({ message });
  } catch (error) {
    console.error(error);
    if (error.message === 'Post not found') {
      res.status(404).json({ error: 'Post not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

async function commentPost(req, res) {
  const { author, postId, text } = req.query;
  try {
    const result = await postService.commentPost(postId, author, text);
    res.json(result);
  } catch (error) {
    console.error(error);
    if (error.message === 'Post not found') {
      res.status(404).json({ error: 'Post not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

async function getPostById(req, res) {
  const postId = req.params.postId;
  try {
    const post = await postService.getPostById(postId);
    res.json(post);
  } catch (error) {
    console.error(error);
    if (error.message === 'Post not found') {
      res.status(404).json({ error: 'Post not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = {
  getAllPosts,
  likePost,
  savePost,
  commentPost,
  getPostById,
  addPost,
  updatePost,
  deletePost
};
