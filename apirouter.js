const express = require('express');
const router = express.Router();
const Catch = require('./models/catch');

router.get('/catches', function(req, res) {
  Catch.find({}, (err, catches) => {
    if (err) {
      return res.status(404).json({ message: 'not found' });
    }
    return res.status(200).json(catches);
  });
});

router.post('/catches', function(req, res) {
  const newCatch = new Catch({
    pokemon: req.body.pokemon,
    location_x: req.body.location_x,
    location_y: req.body.location_y,
    date: req.body.date
  });
  newCatch.save(err => {
    if (err) {
      return res.status(409).json({ message: 'error' });
    }
    return res.status(200).json({ message: 'success' });
  });
});

router.delete('/catches/:id', function(req, res) {
  Catch.deleteOne({ _id: req.params.id }, err => {
    if (err) {
      return res.status(404).json({ message: 'not found' });
    }
    return res.status(200).json({ message: 'success' });
  });
});

router.put('/catches/:id', function(req, res) {
  Catch.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        pokemon: req.body.pokemon,
        location_x: req.body.location_x,
        location_y: req.body.location_y,
        date: req.body.date
      }
    },
    err => {
      if (err) {
        return res.status(409).json({ message: 'conflict' });
      }
      return res.status(200).json({ message: 'success' });
    }
  );
});

module.exports = router;
