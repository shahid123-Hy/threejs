const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file


const app = express();
const cors = require('cors');

app.use(cors());


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

// Define the route for the root URL
app.get('/', (req, res) => {
  res.send("hello");
});

// MongoDB Atlas connection URI from environment variable
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB Atlas
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Connection error:', err));

// Import the User model after establishing the connection
const userModel = require('./models/user');

// Define the route for creating a new user
app.post('/create', async (req, res) => {
  const { username, email, message } = req.body;
  try {
    const user = await userModel.create({ username, email, message });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user', details: err });
  }
});

const PORT = process.env.PORT || 4000;
// Start the server
app.listen(PORT, () => {
  console.log('Server is running on http://localhost:3000');
});
