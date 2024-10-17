const User = require('./models/User');
const jwt = require('jsonwebtoken');

// Function to create a JWT access token
exports.createAccessToken = (user) => {
    return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
        expiresIn: '1h' // Token expiration time
    });
};

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach the verified user object to `req.user`
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// Middleware to verify admin status
exports.verifyAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user && user.isAdmin) {
            next();
        } else {
            res.status(403).json({ error: 'Admin access required' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error verifying admin' });
    }
};
