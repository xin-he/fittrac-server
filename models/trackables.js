var mongoose        = require('mongoose');

// Trackable Schema
var TrackableSchema = mongoose.Schema({
  "name": {},
  "image": {}
});

var Trackable = module.exports = mongoose.model('Trackable', TrackableSchema);

module.exports.addTrackable = function(Trackable, callback) {
  Trackable.create(Trackable, callback);
};

module.exports.getTrackable = function(params, callback, limit) {
  Trackable.findOne(params, callback).limit(limit);
};

module.exports.getTrackables = function(params, callback, limit) {
  Trackable.find(params, callback).limit(limit);
};

module.exports.updateTrackable = function(conditions, update, options, callback) {
  Trackable.findOneAndUpdate(conditions, update, options, callback);
};