const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  pokemon: { type: String, required: true },
  creator: { type: String, required: true },
  description: String,
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
//  date: { type: Date, required: true }
});

module.exports = mongoose.model('catch', Schema);
