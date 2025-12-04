const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },

  login: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  motDePasse: {
    type: String,
    required: true,
    minlength: 6
  },

  role: {
    type: String,
    enum: ['user', 'manager'], 
    default: 'user'
  },

  dateCreation: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;