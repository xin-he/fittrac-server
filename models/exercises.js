var mongoose        = require('mongoose');

// exercise Schema
var exerciseSchema = mongoose.Schema({
  "id": {},
  "license_author": {},
  "status": {},
  "description": {},
  "name": {},
  "creation_date": {},
  "uuid": {},
  "license": {},
  "category": {},
  "language": {},
  "muscles": [],
  "muscles_secondary": [],
  "equipment": [],
  "image" : {}
});

var Exercise = module.exports = mongoose.model('Exercise', exerciseSchema);

module.exports.addExercise = function(exercise, callback) {
  Exercise.create(exercise, callback);
};

module.exports.getExercise = function(params, callback, limit) {
  Exercise.findOne(params, callback).limit(limit);
};

module.exports.getExercises = function(params, callback, limit) {
  Exercise.find(params, callback).limit(limit);
};

module.exports.updateExercise = function(conditions, update, options, callback) {
  Exercise.findOneAndUpdate(conditions, update, options, callback);
};