const mongoose = require('mongoose');

// Define the schema for a blog post
const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the author (User model)
  comments: [{
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the comment author (User model)
    replies: [{
      text: { type: String, required: true },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the reply author (User model)
    }],
  }],
}, { timestamps: true });

// Create the BlogPost model
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;