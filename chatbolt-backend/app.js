const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const config = require('./utils/config');
const MongoStore = require('connect-mongo');

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

module.exports = app;