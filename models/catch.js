const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  pokemon: { type: String, required: true },
  location_x: { type: Number, required: true },
  location_y: { type: Number, required: true },
  date: { type: Date, required: true }
});

module.exports = mongoose.model('catch', Schema);
