'use strict';

let jwt = require('jsonwebtoken');

let User = require('../models/user');

module.exports.auth = (req, res, next) => {
  let token = req.header('Authenticate');
  console.log(token);
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err) {
      req.userId = decoded.id;
    }
    next();
  });
}

module.exports.isAuth = (req, res, next) => {
  if (!req.userId) {
    res.status(401).send('Unauthorised');
  }
  else {
    next();
  }
}

module.exports.enableCORS = (req, res, next) => {
  res.header('Access-Control-Expose-Headers', 'Authenticate');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authenticate, Accept');
  next();
}
