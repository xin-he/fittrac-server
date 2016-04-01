var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var http = require('http');
var https = require('https');

var index   = require('./routes/index');
var config  = require('./config/database');
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
String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 

nutrition.getAllNutrition(function(err, nutritionItems) {
  console.log(nutritionItems.length);
  var otherArray = [];
  for (i = 0; i < nutritionItems.length; i++) {
    // nutrition.updateNutrition({name : nutritionItems[i].name}, {image : "TEST"}, function(err, updatedNutrition){
    //   if (err) {
    //     console.log(err)
    //   }
    //   else {
    //     //console.log(count + " " + fullname + " TEST2\n");
    //   }
    // });
    if (nutritionItems[i].image === "TEST") {
      otherArray.push(nutritionItems[i]);
    }
  }
  nutritionItems = otherArray;
  console.log(nutritionItems.length);
  console.log(otherArray.length);
  var finished = 0;
  var count = 0;
  var getImages = function() {
    link = "https://www.googleapis.com/customsearch/v1?q=" + nutritionItems[count].name.replaceAll("%", "") + "&searchType=image&imgSize=medium&key=AIzaSyB6gvmN9BmNYW0tqw0D-pWfWF6G3P0Xn_E&cx=015241435869049310049:6veyqp-y3kq";
    var fullname = nutritionItems[count].name;
    //console.log(test);
    //console.log(nutritionItems[count].name.replaceAll("%", ""));
    https.request(link, function(response) {
      var str = "";
      response.on('data', function(d) {
        str += d;
      });
      
      response.on('end', function() {
        //console.log(str);
        if (str.indexOf("<") > -1) {
          console.log(str);
          count--;
        }
        else {
          var data = JSON.parse(str);
          //console.log(data);
          if (data.queries && data.queries.request && data.items){
            console.log(data.queries.request[0].searchTerms);
            console.log(data.items[0].link);
            nutrition.updateNutrition({name : fullname}, {image : data.items[0].link}, function(err, updatedNutrition){
              if (err) {
                console.log(err)
              }
              else {
                console.log(count + " " + fullname + "\n");
              }
            });
          }
          else if (!data.error){
            nutrition.updateNutrition({name : fullname}, {image : "http://i.imgur.com/uIzBRDe.png"}, function(err, updatedNutrition){
              if (err) {
                console.log(err)
              }
              else {
                console.log(count + " " + fullname + " TEST2\n");
              }
            });
          }
          else {
            console.log(data.error);
          }
        }
      });
    }).end();
  };
  
  setInterval(function(){
    getImages();
    count++;
  }, 2000);
});