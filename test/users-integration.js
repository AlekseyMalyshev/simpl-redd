'use strict';


let mongodb = require('mongodb');
let ObjectID = mongodb.ObjectID;
let jwt = require('jsonwebtoken');
let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

let server = require('../server');

let database = process.env.MONGOLAB_URI || 'mongodb://localhost/simpl-redd';
let db = mongodb.connect(database);

let User = require('../models/user');

describe('User api', () => {

  let user = new User({
    username: 'sample',
    password: 'test',
    email: 'sample@test.com',
    firstName: 'Andrew',
    lastName: 'Brown',
    phone: '555 438 3899',
    city: 'New York',
    state: 'NY'
  });

  let token;

  before((done) => {
    db.then((db) => {
      db.collection('users')
        .drop()
        .then((result) => {
          expect(result).to.be.true;
          done();
        })
        .catch((err) => {
          // It's OK, posts may not have been created
          done();
        });
    }).catch((err) => {
      done(err);
    });
  });

  after((done) => {
    db.then((db) => {
      db.collection('users')
        .drop()
        .then((result) => {
          expect(result).to.be.true;
          done();
        })
        .catch((err) => {
          // It's OK, posts may not have been created
          done();
        });
    }).catch((err) => {
      done(err);
    });
  });

  describe('/register', () => {
    it('should return a new user.', (done) => {
      chai.request(server)
        .post('/api/users/register')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);

          expect(res.body).to.be.object;
          expect(res.body.username).to.equal(user.username);
          expect(res.body.password).to.equal(null);
          expect(res.body.email).to.equal(user.email);
          expect(res.body.firstName).to.equal(user.firstName);
          expect(res.body.lastName).to.equal(user.lastName);
          expect(res.body.phone).to.equal(user.phone);
          expect(res.body.city).to.equal(user.city);
          expect(res.body.state).to.equal(user.state);
          expect(ObjectID(res.body._id).equals(user._id)).to.be.true;

          done();
        });
    });
  });

  describe('/register', () => {
    it('should not register user with the same username.', (done) => {
      chai.request(server)
        .post('/api/users/register')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(401);

          done();
        });
    });
  });

  describe('/authenticate', () => {
    it('should return a token.', (done) => {
      chai.request(server)
        .post('/api/users/authenticate')
        .send({
          username: user.username,
          password: user.password
        })
        .end((err, res) => {
          expect(res).to.have.status(200);

          token = res.headers['authenticate'];
          expect(token).to.be.string;
          let payload = jwt.decode(token, process.env.JWT_SECRET);
          expect(payload).to.be.object;
          expect(ObjectID(payload.id).equals(user._id)).to.be.true;

          done();
        });
    });
  });

  describe('/authenticate', () => {
    it('should fail if user does not exist.', (done) => {
      chai.request(server)
        .post('/api/users/authenticate')
        .send({
          username: 'non-user',
          password: user.password
        })
        .end((err, res) => {
          expect(res).to.have.status(401);

          done();
        });
    });
  });

  describe('/authenticate', () => {
    it('should fail if password is incorrect.', (done) => {
      chai.request(server)
        .post('/api/users/authenticate')
        .send({
          username: user.username,
          password: 'non-password'
        })
        .end((err, res) => {
          expect(res).to.have.status(401);

          done();
        });
    });
  });

  describe('/me', () => {
    it('should return currently logged user.', (done) => {
      chai.request(server)
        .get('/api/users/me')
        .set('Authenticate', token)
        .end((err, res) => {
          expect(res).to.have.status(200);

          expect(res.body).to.be.object;
          expect(res.body.username).to.equal(user.username);
          expect(res.body.password).to.equal(null);
          expect(res.body.email).to.equal(user.email);
          expect(res.body.firstName).to.equal(user.firstName);
          expect(res.body.lastName).to.equal(user.lastName);
          expect(res.body.phone).to.equal(user.phone);
          expect(res.body.city).to.equal(user.city);
          expect(res.body.state).to.equal(user.state);
          expect(ObjectID(res.body._id).equals(user._id)).to.be.true;

          done();
        });
    });
  });

  describe('/me', () => {
    it('should fail if token in not specified.', (done) => {
      chai.request(server)
        .get('/api/users/me')
        .end((err, res) => {
          expect(res).to.have.status(401);

          done();
        });
    });
  });
});

