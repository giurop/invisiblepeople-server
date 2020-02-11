const express = require('express');

const router = express.Router();

const bcrypt = require('bcrypt');
const passport = require('passport');
const bcryptSalt = 10;

const User = require('../models/User');

router.post('/signup', (req, res, next) => {
  const { username, password, about, email } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Provide username and password' });
    return;
  }

  User.findOne({ username })
  .then(response => res.status(400).json({ message: 'Username taken. Choose another one.' }))
  .catch(err => res.status(500).json({ message: 'Username check went bad.' }));

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = new User ({
    username,
    password: hashPass,
    email,
    about,
  })

  newUser.save(err => {
    if (err) {
      res.status(400).json({ message: 'Saving user to database went wrong.' });
      return;
    }
    req.login(newUser, (err) => {
      if (err) {
        res.status(500).json({ message: 'Login after signup went bad.' });
        return;
      }
    });

    res.status(200).json(newUser);
  });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong authenticating user' });
      return;
    }

    if(!theUser) {
      res.status(401).json(failureDetails);
      return;
    }

    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: 'Session save went bad.' });
        return;
      }

      res.status(200).json(theUser);
    });
  }) (req, res, next);
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json('Successfully logged out.')
});

router.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: 'Unauthorized' });
});

module.exports = router;
