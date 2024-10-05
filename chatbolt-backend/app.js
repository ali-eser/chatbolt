const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const MongoStore = require('connect-mongo');

const User = require('./models/user');

const app = express();

app.use(express.json());
app.use(cors({
  credentials: true,
  origin: true
}));

// set sessions for 24 hours
app.use(session({
  store: MongoStore.create({
    mongoUrl: config.MONGODB_URI
  }),
  secret: config.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 86400000,
    httpOnly: false,
    // secure: false because of dev env
    secure: false,
    sameSite: 'lax'
  }
}));

mongoose.set('strictQuery', false);

// connect to MongoDB server
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((err) => {
    console.log(`error: `, err.message);
  })

// endpoint for getting the current user via their sessionID
app.get('/api/users', async (req, res) => {
  if (req.session) {
    console.log(req.sessionID);
    const user = await User.findOne({ sessionId: req.sessionID } );
    return res.json(user);
  } else {
    res.status(404).send('No user');
  }
});

// endpoint for creating users if they do not have existing entries
app.post('/api/users/create', async (req, res) => {
  // Date.now() is explicitly assigned to a constant to eliminate any 
  // possible difference in microseconds between the session and user model
  const currentDate = Date.now();
  req.session.startedAt = currentDate;
  try {
    const user = new User ({
      sessionId: req.sessionID,
      sessionStart: currentDate
    });
    const newUser = await user.save();
    return res.status(201).json(newUser);
  } catch (err) {
    return res.status(400).json({ err });
  }
});

// endpoint for updating user answers
app.put('/api/users/:id', async (req, res) => {
  try {
    if (req.body.length === 10) {
      // if user has answered every question, set sessionEnd to Date.now()
      const updatedAnswers = await User.findOneAndUpdate(
        { sessionId: req.params.id },
        { $set: { answers: req.body, sessionEnd: Date.now() } },
        { new: true }
      );
      return res.status(200).json(updatedAnswers);
    } else {
      const updatedAnswers = await User.findOneAndUpdate(
        { sessionId: req.params.id },
        { $set: { answers: req.body} },
        { new: true }
      );
      return res.status(200).json(updatedAnswers);
    }
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = app;