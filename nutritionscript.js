var bodyParser 	= require('body-parser');
var mongoose 		= require('mongoose');
var http = require('http');
var https = require('https');

var index 	= require('./routes/index');
var config 	= require('./config/database');
var nutrition = require('./models/nutrition');

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
        nutrition.addNutrition(data.results[i], function() {
          console.log(++finished);
        });
      }
    }
  });
}

//http.request("http://wger.de/api/v2/ingredient.json/?limit=8324", callback).end();

//getting images and putting into mongo
nutrition.getAllNutrition(function(err, nutritionItems) {
  console.log(nutritionItems.length);
  // for (i = 0; i < nutritionItems.length; i++) {
    // if (nutritionItems[i].image !== "TEST" || nutritionItems[i].image.length > 4) {
      // nutritionItems.splice(i,1);
    // }
  // }
  var finished = 0;
  var count = 775;
  var getImages = function() {
    link = "https://www.googleapis.com/customsearch/v1?q=" + nutritionItems[count].name.substring(0,Math.min(nutritionItems[count].name.length, 31)) + "&searchType=image&imgSize=medium&key=AIzaSyB6gvmN9BmNYW0tqw0D-pWfWF6G3P0Xn_E&cx=015241435869049310049%3A6veyqp-y3kq";
    https.request(link, function(response) {
      var str = "";
      response.on('data', function(d) {
        str += d;
      });
      
      var test = nutritionItems[count].name;
      response.on('end', function() {
        //str = str.replace(/<\/?[^>]+(>|$)/g, "");
        //console.log(str);
        if (str.indexOf("<") > -1) {
          console.log(str);
          count--;
        }
        else {
          var data = JSON.parse(str);
          console.log(data);
          //console.log(data.queries.request[0].searchTerms);
          //console.log(data.items[0].link);
          if (data.queries.request[0].searchTerms && data.items[0].link){
            nutrition.updateNutrition({name : test}, {image : data.items[0].link}, function(err, updatedNutrition){
              if (err) {
                console.log(err)
              }
              else {
                console.log(count + " " + test);
              }
            });
          }
        }
      });
    }).end();
  };
  
  setInterval(function(){ 
    getImages();
    count++;
  }, 1500);
});