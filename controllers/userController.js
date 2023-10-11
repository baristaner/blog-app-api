const userService = require('../services/userService');

async function getUserData(req, res) {
  try {
    const userId = req.params.userId;
    const data = await userService.getUserData(userId);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching user data' });
  }
}

async function getUserPosts(req, res) {
  const { authorId } = req.params;

  try {
    const userPosts = await userService.getUserPosts(authorId);
    res.json(userPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

async function followUser(req, res) {
  const { userId, user_id_followed } = req.query;
  try {
    await userService.followUser(userId, user_id_followed);
    res.json({ message: 'User followed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function unfollowUser(req, res) {
  const { userId, user_id_unfollowed } = req.query;
  try {
    await userService.unfollowUser(userId, user_id_unfollowed);
    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function searchAll(req, res) {
  try {
    const query = req.query.q;
    const results = await userService.searchAll(query);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while searching.' });
  }
}

module.exports = {
  getUserData,
  followUser,
  unfollowUser,
  searchAll,
  getUserPosts
};
