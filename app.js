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

mongoose
  .connect(config.dbConnection,
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

module.exports = app;
