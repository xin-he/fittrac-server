var bodyParser 	= require('body-parser');
var mongoose 		= require('mongoose');
var http = require('http');

var index 	= require('./routes/index');
var config 	= require('./config/database');
var nutrition = require('./models/nutrition');

// Connect to the howdiy_db
mongoose.connect(config.database);
var db = mongoose.connection;

var options = {
  host: "https://wger.de",
  path: "/api/v2/ingredient/?limit=5"
};

var callback = function(response) {
  var str = "";
  response.on('data', function(d) {
    str += d;
    console.log(d);
  });
  response.on('end', function() {
    var data = JSON.parse(str);
    console.log(data.results.length);
    //console.log(data.results);
    var finished = 0;
    for (i = 0; i < data.results.length; i++) {
      nutrition.addNutrition(data.results[i], function() {
        console.log(++finished);
      });
    }
  });
}

http.request("http://wger.de/api/v2/ingredient.json/?limit=8324", callback).end();