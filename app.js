const dotenv = require('dotenv');
dotenv.config(); 

const express = require('express');
const methodOverride = require('method-override');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

if (!process.env.JEST_WORKER_ID) {
  mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
}

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
//const authRoutes = require('./auth/AuthProvider');
const imageRoutes = require('./routes/imageRoutes');
const authRoutes = require('./routes/authRoutes');

const port = process.env.PORT || 3000;
const sessionSecret = process.env.SESSION_SECRET;

//Middlewares
app.use(cors());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(session({ secret: sessionSecret, resave: false, saveUninitialized: false }));

// Routes
app.use(postRoutes);
app.use(userRoutes);
app.use(imageRoutes);
app.use(authRoutes);

const server = app.listen(port, () => {
  console.log("Server is running on :", port);
});

module.exports = app;
module.exports.server = server;
