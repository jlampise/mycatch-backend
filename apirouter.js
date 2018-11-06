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
    creator: req.user,
    description: req.body.description,
    lat: req.body.lat,
    lng: req.body.lng
    //date: req.body.date
  });
  newCatch.save(err => {
    if (err) {
      return res.status(409).json({ message: 'error' });
    }
    return res.status(200).json({ message: 'success' });
  });
});

router.delete('/catches/:id', function(req, res) {
  Catch.findById(req.params.id, (err, foundCatch) => {
    if (err) {
      return res.status(404).json({ message: 'not found' });
    }
    if (foundCatch.creator === req.user) {
      Catch.deleteOne({ _id: req.params.id }, err => {
        if (err) {
          return res.status(404).json({ message: 'not found' });
        }
        return res.status(200).json({ message: 'success' });
      });
    } else {
      return res.status(403).json({ message: 'not allowed' });
    }
  });
});

router.put('/catches/:id', function(req, res) {
  Catch.findById(req.params.id, (err, foundCatch) => {
    if (err) {
      return res.status(404).json({ message: 'not found' });
    }
    if (foundCatch.creator === req.user) {
      Catch.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            pokemon: req.body.pokemon,
            description: req.body.description,
            lat: req.body.lat,
            lng: req.body.lng
            //date: req.body.date
          }
        },
        err => {
          if (err) {
            return res.status(409).json({ message: 'conflict' });
          }
          return res.status(200).json({ message: 'success' });
        }
      );
    } else {
      return res.status(403).json({ message: 'not allowed' });
    }
  });
});

module.exports = router;
