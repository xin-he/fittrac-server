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
  "user": {}
});

var Nutrition = module.exports = mongoose.model('Nutrition', NutritionSchema);

module.exports.addNutrition = function(nutrition, callback) {
  Nutrition.create(nutrition, callback);
};
