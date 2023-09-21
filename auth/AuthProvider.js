const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); 
const router = express.Router();

dotenv.config(); 
router.use(express.json());

const sessionSecret = process.env.SESSION_SECRET;


router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body; 
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({ username, email, password: hashedPassword }); 
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        const token = jwt.sign({ userId: user._id }, sessionSecret, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

router.get('/protected', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    
    jwt.verify(token, sessionSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        res.json({ message: 'Authenticated and authorized', userId: decoded.userId });
    });
});

module.exports = router;



