const mongoose = require('mongoose');

// define user schema
const userSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  answers: [{
    type: String
  }],
  sessionStart: {
    type: Date,
    default: Date.now
  },
  sessionEnd: {
    type: Date,
    default: null
  }
});

// remove MongoDB object ID from requests
userSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;