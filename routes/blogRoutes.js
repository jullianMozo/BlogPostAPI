// blogRoutes.js
const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController'); // Import blog controller functions
const { verify, verifyAdmin, isLoggedIn } = require("../auth"); // Import authentication middleware

// Public routes
router.get('/', blogController.getAllPosts); // Get all blog posts
router.get('/:postId', blogController.getPostById); // Get a single blog post

// Authenticated routes
router.post('/:postId/comments', verify, blogController.addCommentToPost); // Add a comment to a blog post
router.post('/', verify, blogController.createPost); // Create a blog post
router.put('/:postId', verify, blogController.editPost); // Edit a blog post
router.delete('/:postId', verify, verifyAdmin, blogController.deletePost); // Delete a blog post

// Admin routes
router.delete('/:postId/comments/:commentId', verify, verifyAdmin, blogController.deleteComment); // Delete a comment (admin only)

module.exports = router;
