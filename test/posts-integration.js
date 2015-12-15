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

let Post = require('../models/post');
let User = require('../models/user');

describe('Post api', () => {

  let user = new User({
    username: 'sampleuser',
    password: 'test',
  });

  let head = new Post({
        title: 'This is a new post',
        message: 'Let\'s write some tests for posts.'
      });

  let child = new Post({
        title: 'This is a reply to the new post',
        message: 'Let\'s write some more tests for posts.',
        reply: head._id,
        head: head._id
      });

  // function addTestUser(done) {
  //   // we need a user, do not care about password encryption
  //   db.collection('users')
  //     .save(user)
  //     .then((result) => {
  //       console.log('fuck 4');
  //       head.user = user._id;
  //       child.user = user._id;
  //       done();
  //     })
  //     .catch((err) => {
  //       console.log('fuck 5');
  //       done(err);
  //     });
  // }

  before((done) => {
    db.then((db) => {
      db.collection('posts')
        .drop()
        .then((result) => {
          //addTestUser(done);
          done();
        })
        .catch((err) => {
          // It's OK, posts may not have been created
          //addTestUser(done);
          done();
        });
    }).catch((err) => {
      done(err);
    });
  });

  // function removeTestUser(done) {
  //   db.then((db) => {
  //     db.collection('users')
  //       .remove({_id: user._id})
  //       .then((result) => {
  //         done();
  //       })
  //       .catch((err) => {
  //         done(err);
  //       });
  //   }).catch((err) => {
  //         done(err);
  //   });

  // }

  after((done) => {
    db.then((db) => {
      db.collection('posts')
        .drop()
        .then((result) => {
          //removeTestUser(done);
          done();
        })
        .catch((err) => {
          // It's OK, posts may not have been created
          //removeTestUser(done);
          done();
        });
    }).catch((err) => {
      done(err);
    });
  });

  describe('/', () => {
    it('should save a new post.', (done) => {
      // first post refers to itself
      head.head = head._id;
      chai.request(server)
        .post('/api/posts')
        .send(head)
        .end((err, res) => {
          console.log('head:', head);
          expect(res).to.have.status(200);

          expect(res.body).to.be.object;
          expect(res.body.title).to.equal(head.title);
          expect(res.body.message).to.equal(head.message);
          expect(ObjectID(res.body._id).equals(head._id)).to.be.true;

          done();
        });
    });
  });

  describe('/', () => {
    let post = new Post({
          title: 'This post should fail!'
        });

    it('should fail if message is empty.', (done) => {
      chai.request(server)
        .post('/api/posts')
        .send(post)
        .end((err, res) => {
          expect(res).to.have.status(400);

          done();
        });
    });
  });

  describe('/', () => {
    it('should save a new post with reference to the former.', (done) => {
      chai.request(server)
        .post('/api/posts')
        .send(child)
        .end((err, res) => {
          expect(res).to.have.status(200);

          expect(res.body).to.be.object;
          expect(res.body.title).to.equal(child.title);
          expect(res.body.message).to.equal(child.message);
          expect(ObjectID(res.body._id).equals(child._id)).to.be.true;

          done();
        });
    });
  });

  describe('/', () => {
    it('should return a single post.', (done) => {
      chai.request(server)
        .get('/api/posts/' + child._id)
        .end((err, res) => {
          expect(res).to.have.status(200);

          expect(res.body).to.be.object;
          expect(res.body.title).to.equal(child.title);
          expect(res.body.message).to.equal(child.message);
          expect(ObjectID(res.body._id).equals(child._id)).to.be.true;

          // Reply to should be populated
          expect(res.body.reply).to.be.object;
          expect(res.body.reply.title).to.equal(head.title);
          expect(res.body.reply.message).to.equal(head.message);
          expect(ObjectID(res.body.reply._id).equals(head._id)).to.be.true;

          // Original to should be populated
          expect(res.body.head).to.be.object;
          expect(res.body.head.title).to.equal(head.title);
          expect(res.body.head.message).to.equal(head.message);
          expect(ObjectID(res.body.head._id).equals(head._id)).to.be.true;

          done();
        });
    });
  });

  describe('/head', () => {
    it('should return a complete thread.', (done) => {
      chai.request(server)
        .get('/api/posts/head/' + head._id)
        .end((err, res) => {
          expect(res).to.have.status(200);

          expect(res.body).to.be.object;
          expect(res.body.length).to.be.number;
          expect(res.body.length).to.equal(2);

          let _head = res.body[0];
          expect(_head.title).to.equal(head.title);
          expect(_head.message).to.equal(head.message);
          expect(ObjectID(_head._id).equals(head._id)).to.be.true;

          let _child = res.body[1];
          expect(_child).to.be.object;
          expect(_child.title).to.equal(child.title);
          expect(_child.message).to.equal(child.message);
          expect(ObjectID(_child._id).equals(child._id)).to.be.true;

          expect(ObjectID(_child.reply).equals(head._id)).to.be.true;
          expect(ObjectID(_child.head).equals(head._id)).to.be.true;

          done();
        });
    });
  });

});

