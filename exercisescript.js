var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var http = require('http');
var https = require('https');

var index   = require('./routes/index');
var config  = require('./config/database');
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

//http.request("http://wger.de/api/v2/exercise.json/?limit=350", callback).end();

//getting images and putting into mongo
exercise.getExercises(function(err, exercises) {
  console.log(exercises);
  var finished = 0;
  for (i = 0; i < exercises.length; i++) {
    link = "https://www.googleapis.com/customsearch/v1?q=" + exercises[i].name + "&searchType=image&imgSize=medium&key=AIzaSyCGzMcWeQr_SIUrs1blR3oTs8Zt_UQKLP8&cx=015241435869049310049%3A6veyqp-y3kq";
    https.request(link, function(response) {
      var str = "";
      response.on('data', function(d) {
        str += d;
      });

      response.on('end', function() {
        var data = JSON.parse(str);
        //console.log(data);
        exercise.updateExercise({name : data.queries.request[0].searchTerms}, {image : data.items[0].link}, function(err, updatedExercise){
          if (err) {
            console.log(err)
          }
          else {
            console.log(++finished);
          }
        });
      });

    }).end();
  }
});