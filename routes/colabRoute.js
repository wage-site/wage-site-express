const Colab = require("../models/colab");
const Blog = require('../models/blog');
const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");
const { isLoggedIn } = require("../loggedInMiddleware");
const multer = require("multer");
const { storage } = require("../cloudinary/cldindex");
const upload = multer({ storage });

router.get("/", async (req, res) => {
  const blogPosts = await Blog.find({});
  const colabPosts = await Colab.find({});
  res.render("colab/index", { colabPosts , blogPosts});
  console.log(colabPosts)
});

router.get("/new", async(req, res) => {
  res.render("colab/new");
});

router.post("/", async (req, res) => {
  const colabNew = new Colab(req.body.colab);
  await colabNew.save();
  res.redirect("/colab");
});

module.exports = router;
