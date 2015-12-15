'use strict';

let express = require('express');
let router = express.Router();

let Post = require('../models/post');
let auth = require('../config/auth');

let checkError = (err, res, post) => {
  if (err) {
    console.log('err: ', err);
    res.status(400).send(err);
  }
  else {
    res.json(post);
  }
}

// New post
router.post('/', (req, res) => {
  console.log('New post:', req.body);
  let post = new Post(req.body);
  if (!post.head) {
    post.head = post._id;
  }
  post.save((err, doc) => {
    checkError(err, res, doc);
  });
});

// Get head posts
router.get('/heads', (req, res) => {
  console.log('Heads requested');
  Post.find({reply: null})
    .populate('user', 'username email _id')
    .exec((err, docs) => {
      checkError(err, res, docs);
    });
});

// Get a thread
router.get('/head/:headId', (req, res) => {
  console.log('A thread is requested');
  Post.find({head: req.params.headId})
    .populate('user', 'username email _id')
    .exec((err, docs) => {
      checkError(err, res, docs);
    });
});

// Get a single post
router.get('/:postId', (req, res) => {
  console.log('Heads requested');
  Post.findOne({_id: req.params.postId})
    .populate('reply', 'title message')
    .populate('head', 'title message')
    .populate('user', 'username email _id')
    .exec((err, docs) => {
      checkError(err, res, docs);
    });
});

module.exports = router;
