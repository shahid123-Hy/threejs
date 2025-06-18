const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  message: { type: String, required: true },
});

// Create and export the user model
module.exports = mongoose.model('User', userSchema);
