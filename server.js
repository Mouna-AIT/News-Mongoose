 // Express Server
 var express = require("express");
 var mongoose = require("mongoose");
 var exphbs = require("express-handlebars"); // Templating Engine
 // Require all models
 var db = require("./models");
 var axios = require("axios");
 var cheerio = require("cheerio");

 var PORT = process.env.PORT || 3000; // Set Default Port for Express and Heroku
 var app = express(); // Initialize Express


 // Set Handlebars as the default templating engine.
 app.engine("handlebars", exphbs({ defaultLayout: "main" }));
 app.set("view engine", "handlebars");

 app.listen(PORT, () => {
     console.log(`App listening on PORT ${PORT}`);
 })