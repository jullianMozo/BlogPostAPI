// blogController.js
const BlogPost = require('../model/Blog'); // Import the BlogPost model

// Get all blog posts (public)
module.exports.getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 }).populate('author', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single blog post (public)
exports.getPostById = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await BlogPost.findById(postId)
      .populate('author', 'username')
      .populate('comments.author', 'username')
      .populate('comments.replies.author', 'username');
      
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a comment to a blog post (authenticated)
exports.addCommentToPost = async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  if (!text) return res.status(400).json({ message: 'Please provide comment text' });

  try {
    const post = await BlogPost.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ text, author: req.user.id }); // Add comment with user ID
    await post.save();

    res.json({ message: 'Comment added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a blog post (only for logged-in users)
exports.createPost = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) return res.status(400).json({ message: 'Please provide title and content' });

  try {
    const newPost = new BlogPost({ title, content, author: req.user.id });
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Edit a blog post (only for the post author or admin)
exports.editPost = async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  try {
    const post = await BlogPost.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to edit this post' });
    }

    post.title = title;
    post.content = content;
    await post.save();

    res.json({ message: 'Post updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a blog post (only for the post author or admin)
exports.deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await BlogPost.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (req.user.isAdmin || post.author.toString() === req.user.id) {
      await post.deleteOne();
      return res.json({ message: 'Post deleted successfully' });
    } else {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a comment (admin only)
exports.deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const post = await BlogPost.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);

    if (commentIndex === -1) return res.status(404).json({ message: 'Comment not found' });

    post.comments.splice(commentIndex, 1); // Remove the comment
    await post.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


