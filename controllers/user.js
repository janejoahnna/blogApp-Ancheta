const bcrypt = require('bcrypt');
const User = require("../models/User");
const auth = require("../auth");

module.exports.registerUser = (req, res) => {
    console.log("Received registration data:", req.body);

    // Validate email and password requirements
    if (!req.body.email.includes("@")) {
        return res.status(400).send({ error: "Email invalid" });
    } else if (req.body.password.length < 8) {
        return res.status(400).send({ error: "Password must be at least 8 characters" });
    } else {
        // Create a new user instance with hashed password
        let newUser = new User({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        return newUser.save()
            .then(() => {
                console.log("User registered successfully.");
                res.status(201).send({ message: "Registered Successfully" });
            })
            .catch(err => {
                console.error("Error in saving:", err);
                if (err.code === 11000) { // Duplicate key error
                    return res.status(400).send({ error: "Email is already registered" });
                }
                return res.status(500).send({ error: "Error in save" });
            });
    }
};

module.exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    console.log("Attempting to log in user:", email); // Debugging line

    if (!email.includes("@")) {
        return res.status(400).send({ error: "Invalid email" });
    }

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).send({ error: "No email found" });
            }

            const isPasswordCorrect = bcrypt.compareSync(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(401).send({ error: "Email and password do not match" });
            }

            const token = auth.createAccessToken(user); // Ensure this function is defined
            console.log("Login successful for user:", email); // Debugging line
            res.status(200).send({ message: "Login successful", access: token });
        })
        .catch(err => {
            console.error("Error during login:", err);
            res.status(500).send({ error: "Internal server error" });
        });
};


module.exports.getProfile = (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(400).send({ error: 'User ID not found in token' });
    }
    return User.findById(req.user.id)
    .then(user => {
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        user.password = undefined; // Do not expose password
        return res.status(200).send({ user });
    })
    .catch(err => {
        console.error("Error in fetching user profile", err);
        return res.status(500).send({ error: 'Failed to fetch user profile' });
    });
};

