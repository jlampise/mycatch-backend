'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const apiRouter = require('./apirouter.js');

mongoose
  .connect(
    'mongodb://localhost:27017/mycatchdb',
    { useNewUrlParser: true }
  )
  .then(
    () => {
      console.log('MongoDB connection success');
    },
    error => {
      console.log('MongoDB connection failure! Error: ' + error);
      process.exit(-1);
    }
  );

app.use(bodyParser.json());

// Setup routes
app.use('/api', apiRouter);

module.exports = app;
