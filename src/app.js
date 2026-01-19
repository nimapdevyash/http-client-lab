require('dotenv').config();
const express = require('express');
const app = express();

const usersRoutes = require('./routes/users.routes');
const postsRoutes = require('./routes/posts.routes');
const filesRoutes = require('./routes/files.routes');
const errorHandler = require('./middleware/error.middleware');

app.use(express.json());

app.use('/users', usersRoutes);
app.use('/posts', postsRoutes);
app.use('/files', filesRoutes);
app.set("json spaces", 2);

app.use(errorHandler);

module.exports = app;
