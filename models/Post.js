const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: {type: Date, default: Date.now}
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  imagePath: String,
  date: { type: Date, default: Date.now },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema], 
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Post', postSchema);
