"use strict";
const express   = require('express');
const passport  = require('passport'); 
const router    = express.Router();
const TokenHelpers  = require('../utility/token-helpers');
const Nutrition     = require('../models/nutrition.js');
const Exercise      = require('../models/exercise.js');
const Users         = require('../models/users');
require('../config/passport')(passport);

// GET
router.get('/nutrition', passport.authenticate('jwt', { session: false}), (req, res) => {
  TokenHelpers.verifyToken(req, res, (req, res) => {
    Nutrition.getNutritions({"name": {$regex: req.query.q, $options: 'i'}}, req.query.projection, (err, nutritions) => {
      if(err) {
        console.log(err);
      }
      res.json(nutritions);  
    });
  });
});

// GET
router.get('/exercise', passport.authenticate('jwt', { session: false}), (req, res) => {
  TokenHelpers.verifyToken(req, res, (req, res) => {
    Exercise.getExercises({"name": {$regex: req.query.q, $options: 'i'}}, req.query.projection, (err, exercises) => {
      if(err) {
        console.log(err);
      }
      res.json(exercises);  
    });
  });
});

module.exports = router;