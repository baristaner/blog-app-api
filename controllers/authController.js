const authService = require('../services/authService');
const express = require('express');

async function signUp(req, res) {
  const { username, email, password } = req.body;
  const profilePicturePath = req.file ? req.file.path : null;

  try {
    const result = await authService.signUp(username, email, password, profilePicturePath);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register user' });
  }
}

async function login(req, res) {
  const { username, password } = req.query;
  try {
    const tokenData = await authService.authenticateUser(username, password);
    res.json({ token: tokenData.token });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}

async function protectedRoute(req, res) {
  const token = req.headers.authorization.split(' ')[1];

  try {
    const result = await authService.verifyToken(token);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}

module.exports = {
  signUp,
  login,
  protectedRoute
};
