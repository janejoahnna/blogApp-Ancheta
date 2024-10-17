const Post = require('../models/Post');

// Create a new post
module.exports.createPost = (req, res) => {
  const { title, content, author, createdAt } = req.body;
  
  if (!title || !content || !author || !createdAt) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  const newPost = new Post({
    title,
    content,
    author,
    createdAt: createdAt || new Date()
  });

  newPost.save()
    .then(post => res.status(201).send(post))
    .catch(error => auth.errorHandler(error, req, res));
};

// Get all posts
module.exports.getPosts = (req, res) => {
  Post.find({})
    .then(posts => res.status(200).send(posts))
    .catch(error => auth.errorHandler(error, req, res));
};

// Get a single post by ID
module.exports.getPostById = (req, res) => {
  Post.findById(req.params.postId)
    .then(post => {
      if (!post) return res.status(404).send({ message: 'Post not found' });
      res.status(200).send(post);
    })
    .catch(error => auth.errorHandler(error, req, res));
};

// Update a post by ID
module.exports.updatePost = (req, res) => {
  const { postId } = req.params;
  const { title, content, author, createdAt } = req.body;

  // Ensure all fields are provided
  if (!title || !content || !author || !createdAt) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  Post.findByIdAndUpdate(postId, { title, content, author, createdAt }, { new: true })
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(200).json({ message: 'Post updated successfully', post });
    })
    .catch(error => {
      console.error('Error updating post:', error);
      res.status(500).json({ message: 'Server error', error });
    });
};

// Delete a post by ID
module.exports.deletePost = (req, res) => {
  const { postId } = req.params;

  // Check if postId is valid and delete the post
  Post.findByIdAndDelete(postId)
    .then(post => {
      if (!post) {
        // If post with postId doesn't exist
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(200).json({ message: 'Post deleted successfully', post });
    })
    .catch(error => {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'Server error', error });
    });
};

// Add a comment to a post
module.exports.addComment = (req, res) => {
  const { postId } = req.params;
  const { user, text } = req.body;

  if (!user || !text) {
    return res.status(400).send({ message: 'User and comment text are required' });
  }

  Post.findByIdAndUpdate(
    postId,
    { $push: { comments: { user, text, createdAt: new Date() } } }, // Add a new comment to comments array
    { new: true }
  )
    .then(post => {
      if (!post) return res.status(404).send({ message: 'Post not found' });
      res.status(200).send({ message: 'Comment added successfully', post });
    })
    .catch(error => auth.errorHandler(error, req, res));
};

// Get comments for a post
module.exports.getComments = (req, res) => {
  const { postId } = req.params;

  Post.findById(postId)
    .then(post => {
      if (!post) return res.status(404).send({ message: 'Post not found' });
      res.status(200).send(post.comments); // Return only the comments array
    })
    .catch(error => auth.errorHandler(error, req, res));
};
