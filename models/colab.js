const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colabSchema = new Schema({
  title: String,
  image: [
    {
      url: String,
      filename: String,
    },
  ],
  category: String,
  description: String,
  link: String,
});

module.exports = mongoose.model("Colab", colabSchema);
