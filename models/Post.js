const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
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
  comments: [commentSchema], // Yorumları burada bir dizi olarak tanımlıyoruz
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Post', postSchema);
