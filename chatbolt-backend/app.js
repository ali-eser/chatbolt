const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const config = require('./utils/config');
const MongoStore = require('connect-mongo');

const User = require('./models/user');

const app = express();

mongoose.set('strictQuery', false);

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((err) => {
    console.log(`error: `, err.message);
  })

app.use(express.json());
app.use(session({
  name: 'chatbolt-session',
  secret: config.SECRET,
  resave: false,
  store: MongoStore.create({
    client: mongoose.connection.getClient()
  })
}));

app.get('/api/users', async (req, res) => {
  if (req.session) {
    const user = await User.findOne({ sessionId: req.sessionID } );
    return res.json(user);
  } else {
    res.status(404).json({ error: 'No session' });
  }
});

app.post('/api/users/create', async (req, res) => {
  req.session.questionIndex = 0;

  // Date.now() explicitly assigned to a constant to eliminate any 
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

app.put('/api/users/:id', async (req, res) => {
  try{
    const updatedAnswers = await User.findOneAndUpdate(
      { sessionId: req.params.id },
      { $set: { answers: req.body.answers } },
      { new: true }
    );
    // req.session.questionIndex = TODO
    return res.status(200).json(updatedAnswers)
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = app;