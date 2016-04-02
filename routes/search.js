"use strict";
const express   = require('express');
const passport  = require('passport'); 
const router    = express.Router();
const TokenHelpers  = require('../utility/token-helpers');
const Nutrition     = require('../models/nutrition.js');
const Exercise      = require('../models/exercises.js');
const Users         = require('../models/users');
const Trackables    = require('../models/trackables');
require('../config/passport')(passport);

// GET
router.get('/nutrition', passport.authenticate('jwt', { session: false}), (req, res) => {
  TokenHelpers.verifyToken(req, res, (req, res) => {    
    console.log('before: ' + req.query.q);
    Nutrition.getAllNutrition({"name": {$regex: req.query.q, $options: 'i'}}, (err, nutritions) => {
      console.log('in');
      if(err) {
        console.log(err);
      }
      res.json(nutritions);  
    }, 10);
  });
});

// GET
router.get('/exercise', passport.authenticate('jwt', { session: false}), (req, res) => {
  TokenHelpers.verifyToken(req, res, (req, res) => {    
    Exercise.getExercises({"name": {$regex: req.query.q, $options: 'i'}}, (err, exercises) => {      
      if(err) {
        console.log(err);
      }
      console.log(exercises.length);
      res.json(exercises);  
    }, 10);
  });
});

// GET
router.get('/trackable', passport.authenticate('jwt', { session: false}), (req, res) => {
  TokenHelpers.verifyToken(req, res, (req, res) => {    
    Trackables.getTrackables({"name": {$regex: req.query.q, $options: 'i'}}, (err, trackables) => {      
      if(err) {
        console.log(err);
      }
      console.log(trackables.length);
      res.json(trackables);  
    }, 10);
  });
});

module.exports = router;