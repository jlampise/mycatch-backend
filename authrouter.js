const express = require('express');
const router = express.Router();
const userModel = require('./models/user');
const bcrypt = require('bcrypt-nodejs');
const rateLimit = require('express-rate-limit');

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message:
    'Too many accounts created from this IP, please try again after an hour'
});

// user database
const loggedUsers = [];

const isUserLogged = (req, res, next) => {
  const token = req.headers.token;
  for (let i = 0; i < loggedUsers.length; i++) {
    if (token === loggedUsers[i].token) {
      req.user = loggedUsers[i].username;
      return next();
    }
  }
  return res.status(403).json({ message: 'not allowed' });
};

const createToken = () => {
  let token = '';
  let letters = 'abcdefghijklmnABCDEFGHIJKLMN1234567890';
  for (let i = 0; i < 1024; i++) {
    let j = Math.floor(Math.random() * 38);
    token = token + letters[j];
  }
  return token;
};

function createHash(pw) {
  return bcrypt.hashSync(pw, bcrypt.genSaltSync(8), null);
}

function isPasswordValid(pw, hash) {
  return bcrypt.compareSync(pw, hash);
}

// LOGIN API

router.post('/register', registerLimiter, function(req, res) {
  if (
    !req.body.username ||
    !req.body.password ||
    req.body.username.length === 0 ||
    req.body.password === 0
  ) {
    return res.status(409).json({ message: 'username already in use' });
  }

  const user = new userModel({
    username: req.body.username,
    password: createHash(req.body.password)
  });
  user.save(err => {
    if (err) {
      return res.status(409).json({ message: 'username already in use' });
    } else {
      return res.status(200).json({ message: 'success' });
    }
  });
});

router.post('/login', function(req, res) {
  userModel.findOne({ username: req.body.username }, (err, user) => {
    if (err || !user) {
      return res.status(403).json({ message: 'Wrong username or password' });
    } else {
      if (isPasswordValid(req.body.password, user.password)) {
        const token = createToken();
        loggedUsers.push({ username: user.username, token });
        return res.status(200).json({ token });
      }
    }
    return res.status(403).json({ message: 'Wrong username or password' });
  });
});

router.post('/logout', function(req, res) {
  const token = req.headers.token;
  for (let i = 0; i < loggedUsers.length; i++) {
    if (token === loggedUsers[i].token) {
      loggedUsers.splice(i, 1);
      return res.status(200).json({ message: 'success' });
    }
  }
  return res.status(404).json({ message: 'not found' });
});

module.exports = {
  router,
  isUserLogged
};
