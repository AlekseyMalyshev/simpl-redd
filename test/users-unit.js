'use strict';

let mongodb = require('mongodb');
let ObjectID = mongodb.ObjectID;
let jwt = require('jsonwebtoken');
let chai = require('chai');
let expect = chai.expect;

let User = require('../models/user');

let user = new User({
  username: 'andrew',
  password: 'test',
});

describe('User object', () => {
  describe('token', () => {
    it('should create a jwt with user id.', (done) =>{
      user.encryptPass(() => {
        user.validatePass('test', (err, result) => {
          expect(err).to.be.undefined;
          expect(result).to.be.true;

          done();
        })
      });
    });
  });
  describe('encryptPass and validatePass', () => {
    it('should compare hashed passwords.', (done) =>{
      user
      let token = user.token();
      expect(token).to.be.string;
      let payload = jwt.decode(token, process.env.JWT_SECRET);
      expect(payload).to.be.object;
      expect(ObjectID(payload.id).equals(user._id)).to.be.true;

      done();
    });
  });
});
