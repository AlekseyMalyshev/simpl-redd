'use strict';

let express = require('express');
let router = express.Router();

let User = require('../models/user');
let auth = require('../config/auth');

let checkError = (err, res, user) => {
  if (err) {
    console.log('err: ', err);
    res.status(400).send(err);
  }
  else {
    res.json(user);
  }
}

// user registration
router.post('/register', (req, res) => {
  console.log('New user posted:', req.body);
  User.findOne({username: req.body.username}, (err, user) => {
    if (err) {
      checkError(err, res);
    }
    else if (user !== null) {
      res.status(401).send('User already exists');
    }
    else {
      let user = new User(req.body);
      user.encryptPass((err) => {
        if (err) {
          console.log(err);
          res.status(500).send('Encryption failed');
        }
        else {
          user.save((err, doc) => {
            if (!err) {
              doc.password = null;
            }
            checkError(err, res, doc);
          });
        }
      });
    }
  });
});

// User authentication
router.post('/authenticate', (req, res) => {
  console.log('Authenticating', req.body.username);
  User.findOne({username: req.body.username}, (err, doc) => {
    if (err) {
      console.error('Database error: ', err);
      res.status(500).send();
    }
    else if (doc === null) {
      console.log('User not found.');
      res.status(401).send();
    }
    else {
      doc.validatePass(req.body.password, (err, result) => {
        if (err || !result) {
          console.log('Password check failed ', err);
          res.status(401).send();
        }
        else {
          console.log('Logged in.');
          let token = doc.token();
          if (token) {
            res.setHeader('Authenticate', token);
            res.send();
          }
          else {
            res.status(500).send();
          }
        }
      });
    }
  });
});

// the user may request their details
router.get('/me', auth.isAuth, (req, res) => {
  let id = req.userId;
  User.findOne({_id: id}, (err, user) => {
    if (err) {
      checkError(err, res);
    }
    else if (!user) {
      res.status(401).send('Authentication error');
    } 
    else {
      user.password = null;
      res.json(user);
    }
  });
});

// the user may update their record
router.put('/me', auth.isAuth, (req, res) => {
  if (!req.body.password) {
    updateUser(req, res, req.body)
  }
  else {
    let user = new User(req.body);
    user._id = req.userId;
    console.log(user);
    user.encryptPass((err) => {
      if (err) {
        checkError(err, res);
      }
      else {
        updateUser(req, res, user);
      }
    });
  }
});

function updateUser(req, res, user) {
  User.findOneAndUpdate({_id: req.userId}, user, {new: true}, (err, doc) => {
    if (err) {
      checkError(err, res);
    }
    else {
      doc.password = null;
      res.json(doc);
    }
  });
}

module.exports = router;
