var mongoose        = require('mongoose');

// User Schema
var NutritionSchema = mongoose.Schema({
  id: {},
  license_author: {},
  status: {},
  creation_date: {},
  "name": {},
  "energy": {},
  "protein": {},
  "carbohydrates": {},
  "carbohydrates_sugar": {},
  "fat": {},
  "fat_saturated": {},
  "fibres": {},
  "sodium": {},
  "license": {},
  "language": {},
  "user": {},
  "image": {}
});

var Nutrition = module.exports = mongoose.model('Nutrition', NutritionSchema);

module.exports.addNutrition = function(nutrition, callback) {
  Nutrition.create(nutrition, callback);
};

module.exports.getNutrition = function(params, callback, limit) {
  Nutrition.findOne(params, callback).limit(limit);
};

module.exports.getAllNutrition = function(params, callback, limit) {
  Nutrition.find(params, callback).limit(limit);
};

module.exports.updateNutrition = function(conditions, update, options, callback) {
  Nutrition.findOneAndUpdate(conditions, update, options, callback);
};

module.exports.updateTest = function(a,b,c,d) {
  console.log("test");
}