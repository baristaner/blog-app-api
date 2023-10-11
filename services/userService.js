const User = require('../models/User');
const Post = require('../models/Post');
const ObjectId = require('mongoose').Types.ObjectId;

async function getUserData(userId) {
  if (!ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const posts = await Post.find({ author: userId });

  return { user, posts };
}

async function getUserPosts(authorId) {
  const userPosts = await Post.find({ author: authorId });

  if (!userPosts || userPosts.length === 0) {
    throw new Error('No post found.');
  }

  return userPosts;
}

async function followUser(userId, user_id_followed) {
  const user = await User.findById(userId);
  const followedUser = await User.findById(user_id_followed);

  if (!followedUser) {
    throw new Error('Followed user not found');
  }

  if (!user.following.includes(user_id_followed)) {
    user.following.push(user_id_followed);
  } else {
    throw new Error('User is already following this user');
  }

  followedUser.followers.push(userId);

  await user.save();
  await followedUser.save();
}

async function unfollowUser(userId, user_id_unfollowed) {
  const user = await User.findById(userId);
  const unfollowedUser = await User.findById(user_id_unfollowed);

  if (!unfollowedUser) {
    throw new Error('Unfollowed user not found');
  }

  const index = user.following.indexOf(user_id_unfollowed);
  if (index !== -1) {
    user.following.splice(index, 1);
  } else {
    throw new Error('User is not following this user');
  }

  const followerIndex = unfollowedUser.followers.indexOf(userId);
  if (followerIndex !== -1) {
    unfollowedUser.followers.splice(followerIndex, 1);
  }

  await user.save();
  await unfollowedUser.save();
}

async function searchAll(query) {
  if (!query) {
    throw new Error('Search query is missing.');
  }

  const userResults = await User.find({ username: { $regex: new RegExp(query, 'i') } });
  const postResults = await Post.find({ title: { $regex: new RegExp(query, 'i') } });

  if (userResults.length === 0 && postResults.length === 0) {
    throw new Error('No results found.');
  }

  return { users: userResults, posts: postResults };
}

module.exports = {
  followUser,
  unfollowUser,
  searchAll,
  getUserPosts,
  getUserData
};
