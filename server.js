// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var path = require("path");

// Scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

app.use(logger("dev"));
// Handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Serve the public folder as a static directory
app.use(express.static(path.join(__dirname, 'public')));

app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
var results = [];

// Routes

app.get("/", function(req, res) {
    res.render("index");
});

// A GET route for scraping the Daily Universe website
app.get("/scrape", function(req, res) {
    var found;
    var titleArr = [];
    db.Article.find({})
        .then(function(dbArticle) {
            for (var j = 0; j < dbArticle.length; j++) {
                titleArr.push(dbArticle[j].title)
            }
            // console.log(titleArr);
            request("https://universe.byu.edu/", function(error, response, html) {
                if (!error && response.statusCode == 200) {}

                var $ = cheerio.load(html, {
                    xml: {
                        normalizeWhitespace: true,
                    }
                })
                $("body h3").each(function(i, element) {
                    var result = {};
                    result.title = $(element).children("a").text();
                    found = titleArr.includes(result.title);
                    result.link = $(element).children("a").attr("href");
                    result.excerpt = $(element).parent().children(".td-excerpt").text().trim();
                    if (!found && result.title && result.link) {
                        results.push(result);
                    }
                });
                res.render("scrape", {
                    articles: results
                });
            })
        });
});

// Route for getting all Articles from the db
app.get("/saved", function(req, res) {
    db.Article.find({})
        .then(function(dbArticle) {
            // console.log(dbArticle);
            res.render("saved", {
                saved: dbArticle
            });
        })
        .catch(function(err) {

            res.json(err);
        });
});

// Route for creating an Article in the db
app.post("/api/saved", function(req, res) {
    db.Article.create(req.body)
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {

            res.json(err);
        });
});

// Route for grabbing a specific Article by id
app.get("/articles/:id", function(req, res) {
    // console.log(req.params.id);
    // console.log(mongoose.Types.ObjectId.isValid(req.params.id));
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).send('Invalid object id');
        return;
    }
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function(dbArticle) {
            // If we were able to successfully find an Article
            // console.log(dbArticle);
            if (dbArticle) {
                res.render("articles", {
                    data: dbArticle
                });
            }
        })
        .catch(function(err) {

            res.json(err);
        });
});

//Route for deleting an article from the db
app.delete("/saved/:id", function(req, res) {
    db.Article.deleteOne({ _id: req.params.id })
        .then(function(removed) {
            res.json(removed);
        }).catch(function(err, removed) {
            res.json(err);
        });
});

//Route for deleting a note
app.delete("/articles/:id", function(req, res) {
    db.Note.deleteOne({ _id: req.params.id })
        .then(function(removed) {
            res.json(removed);
        }).catch(function(err, removed) {
            res.json(err);
        });
});


app.post("/articles/:id", function(req, res) {
    // Create a new note 
    db.Note.create(req.body)
        .then(function(dbNote) {
            db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true })
                .then(function(dbArticle) {
                    // console.log(dbArticle);
                    res.json(dbArticle);
                })
                .catch(function(err) {
                    res.json(err);
                });
        })
        .catch(function(err) {
            res.json(err);
        })
});

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});