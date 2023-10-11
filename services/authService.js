const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const sessionSecret = process.env.SESSION_SECRET;

async function authenticateUser(username, password) {
    const user = await User.findOne({ username });

    if (!user) {
        throw new Error('Authentication failed: User not found');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new Error('Authentication failed: Incorrect password');
    }

    const token = jwt.sign({ userId: user._id }, sessionSecret, { expiresIn: '1h' });
    return { token };
}

async function signUp(username, email, password, profilePicturePath) {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePicture: profilePicturePath,
    });
    return { message: 'User registered successfully' };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to register user');
  }
}

async function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, sessionSecret, (err, decoded) => {
      if (err) {
        reject('Authentication failed');
      } else {
        resolve({ message: 'Authenticated and authorized', userId: decoded.userId });
      }
    });
  });
}

module.exports = {
  authenticateUser,
  signUp,
  verifyToken
};
