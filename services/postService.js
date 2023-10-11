const Post = require('../models/Post');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

async function addPost(title, content, author, imagePath) {
  try {
    const newPost = new Post({
      title,
      content,
      author,
      imagePath,
    });
    await newPost.save();
    return newPost;
  } catch (error) {
    console.error('Error in addPost:', error);
    throw new Error('Internal server error');
  }
}

async function updatePost(postId, userId, title, content) {
  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error('Post not found');
    }

    if (post.author.toString() !== userId) {
      throw new Error('Unauthorized to update this post');
    }

    await Post.findByIdAndUpdate(postId, {
      title,
      content,
    });

    return { id: postId, title, content };
  } catch (error) {
    console.error('Error in updatePost:', error);
    throw new Error('Internal server error');
  }
}

async function deletePost(postId, userId) {
  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error('Post not found');
    }

    if (post.author.toString() !== userId) {
      throw new Error('Unauthorized to delete this post');
    }

    console.log('Post before removal:', post);

    // Use deleteOne to remove the post by its ID
    await Post.deleteOne({ _id: postId });

    console.log('Post removed successfully');

    return true;
  } catch (error) {
    console.error('Error in deletePost:', error);
    throw new Error('Internal server error');
  }
}

async function getAllPosts() {
  try {
    const posts = await Post.find();
    return posts;
  } catch (error) {
    throw new Error('Internal server error');
  }
}

async function likePost(author, postId) {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const authorObjectId = new mongoose.Types.ObjectId(author);
    const likeIndex = post.likes.indexOf(authorObjectId);

    if (likeIndex !== -1) {
      post.likes.splice(likeIndex, 1);
      await post.save();
      return 'Post unliked successfully';
    }

    post.likes.push(authorObjectId);
    await post.save();
    return 'Post liked successfully';
  } catch (error) {
    console.error('Error in likePost:', error); 
    throw new Error('Internal server error');
  }
}

async function savePost(author, postId) {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const isSaved = post.savedBy.includes(author);

    if (isSaved) {
      post.savedBy.pull(author);
    } else {
      post.savedBy.push(author);
    }

    await post.save();
    return isSaved ? 'Post unsaved successfully' : 'Post saved successfully';
  } catch (error) {
    throw new Error('Internal server error');
  }
}

async function commentPost(postId, author, text) {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const newComment = {
      text,
      author: author,
    };

    post.comments.push(newComment);
    await post.save();
    return { message: 'Comment added successfully', comment: newComment };
  } catch (error) {
    throw new Error('Internal server error');
  }
}

async function getPostById(postId) {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  } catch (error) {
    throw new Error('Internal server error');
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
