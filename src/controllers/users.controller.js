
const Users = require('../models/users.model');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await Users.getAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await Users.getById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const result = await Users.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const changes = await Users.update(req.params.id, req.body);
    if (!changes) return res.status(404).json({ error: 'User not found' });
    res.json({ updated: true });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const changes = await Users.remove(req.params.id);
    if (!changes) return res.status(404).json({ error: 'User not found' });
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
};
