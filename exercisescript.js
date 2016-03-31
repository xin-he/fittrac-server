var bodyParser 	= require('body-parser');
var mongoose 		= require('mongoose');
var http = require('http');

var index 	= require('./routes/index');
var config 	= require('./config/database');
var exercise = require('./models/exercises');

// Connect to the howdiy_db
mongoose.connect(config.database);
var db = mongoose.connection;

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
      if (data.results[i].language === 2) {
        exercise.addExercise(data.results[i], function() {
          console.log(++finished);
        });
      }
    }
  });
}

http.request("http://wger.de/api/v2/exercise.json/?limit=350", callback).end();
