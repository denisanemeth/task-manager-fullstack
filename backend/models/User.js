

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name este obligatoriu'],
      trim: true
    },
    
    email: {
      type: String,
      required: [true, 'Email este obligatoriu'],
      unique: true,
      lowercase: true,
      trim: true
    },
    
    password: {
      type: String,
      required: [true, 'Password este obligatoriu']
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;