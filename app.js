require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

const cors = require('cors');

mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then((response) => console.log(`MongoDB: ${response.connections[0].name}`))
  .catch(err => console.log(err));

const session = require('express-session');
const passport = require('passport');

require('./config/passport');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'invisible-faces',
  resave: true,
  saveUninitialized: true,
}));

app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000']
}));

app.use(passport.initialize());
app.use(passport.session());

const index = require('./routes/index');
app.use('/', index);

app.listen(process.env.PORT, () => console.log(`Listening on Port: ${process.env.PORT}`));

module.exports = app;
