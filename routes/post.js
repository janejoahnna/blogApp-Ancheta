const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const auth = require('../auth');

// Admin-only routes
router.post('/addPost', auth.verifyToken, auth.verifyAdmin, postController.createPost);
router.put('/updatePost/:id', auth.verifyToken, auth.verifyAdmin, postController.updatePost);
router.delete('/deletePost/:id', auth.verifyToken, auth.verifyAdmin, postController.deletePost);

// Authenticated user routes
router.get('/getPosts', auth.verifyToken, postController.getPosts);
router.get('/getPost/:id', auth.verifyToken, postController.getPostById);
router.post('/addComment/:id', auth.verifyToken, postController.addComment);
router.get('/getComments/:id', auth.verifyToken, postController.getComments);

module.exports = router;
