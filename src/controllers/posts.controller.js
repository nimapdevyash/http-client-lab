
const Posts = require('../models/posts.model');

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Posts.getAll(req.query);
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const post = await Posts.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};
