const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.connection.once("open", () => console.log("Connected to MongoDB"));

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

app.use('/user', userRoutes);
app.use('/posts', postRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
