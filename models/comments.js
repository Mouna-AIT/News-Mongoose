var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Commentschema = new Schema({
    title: {
        type: String,
    },
    body: {
        type: String,
    }
});

var Note = mongoose.model("Comment", Commentschema);
module.exports = Note;