const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://baristaner:eWpmDUKprbTnjpHC@cluster0.fxr7vvm.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express');
const methodOverride = require('method-override');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');


const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/adminRoutes');
const postRoutes = require('./routes/posts');
const authRoutes = require('./auth/AuthProvider');

//Middlewares
app.use(cors());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));

// Routes
app.use(indexRoutes);
app.use(adminRoutes);
app.use(postRoutes);
app.use(authRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
