const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: String,
    author: String,
    category: String,
    date: String,
    preview:String,
    description: String
});

module.exports = mongoose.model('Blog', blogSchema);