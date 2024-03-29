var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    // `title` is of type String
    title: String,
    // `body` is of type String
    body: String
});

var Note = mongoose.model("note", NoteSchema);

// Export the Note model
module.exports = Note;