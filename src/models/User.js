const mongoose = require('mongoose'); /// imports the Mongoose Library 

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,         // must be provided
  },
  email: {
    type: String,
    required: true,         // must be provided
    unique: true,           // no two users can share the same email
  },
  password: {
    type: String,
    required: true,         // will be hashed
  },
  description: {
    type: String,           // optional field user can add
  },
  hasDescription: {
    type: Boolean,
    default: false          // will be true if user submits a description
  },
  phone: {
    type: String,           
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'         // role defaults to 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'       // used for future status handling
  },
  isActive: {
    type: Boolean,
    default: true           // marks if user is currently active
  },
  lastActive: {
    type: Date,
    default: Date.now       // auto-tracks last request time
  },
  createdAt: {
    type: Date,
    default: Date.now       // automatic timestamp
  }
});

// Export the User model to be used in controllers
module.exports = mongoose.model('User', UserSchema);
