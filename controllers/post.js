const Post = require('../models/Post');

// Create a new post
exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  const author = req.user.id;
  try {
    const newPost = new Post({ title, content, author });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).send('Error creating post');
  }
};

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.json(posts);
  } catch (error) {
    res.status(400).send('Error fetching posts');
  }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author comments.user'); // Populate as necessary
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a post by ID
exports.updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPost);
  } catch (error) {
    res.status(400).send('Error updating post');
  }
};

// Delete a post by ID
exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).send('Error deleting post');
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  // Assuming comment handling logic here
};

// Get comments for a post
exports.getComments = async (req, res) => {
  // Assuming comment handling logic here
};
