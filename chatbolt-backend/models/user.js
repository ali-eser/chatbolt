const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  answers: [{
    index: {
      type: Number
    },
    text: {
      type: String
    }
  }],
  sessionStart: {
    type: Date,
    default: Date.now
  },
  sessionEnd: {
    type: Date
  }
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;