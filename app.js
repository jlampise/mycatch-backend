'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const apiRouter = require('./apirouter.js');
const authRouter = require('./authrouter').router;
const isUserLogged = require('./authrouter').isUserLogged;
const config = require('./config');
const log = config.logger;

app.enable('trust proxy');

mongoose
  .connect(
    config.dbConnection,
    { useNewUrlParser: true }
  )
  .then(
    () => {
      log.info('MongoDB connection success');
    },
    error => {
      log.error('MongoDB connection failure! Error: ' + error);
      process.exit(-1);
    }
  );

app.use(bodyParser.json());

// Setup routes
app.use('/auth', authRouter);

app.use('/api', isUserLogged, apiRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));

  app.get('*', (req, res) => {
    res.sendFile(__dirname + '/build/index.html');
  });
}

module.exports = app;
