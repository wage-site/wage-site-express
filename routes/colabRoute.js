const Colab = require("../models/colab");
const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");
const { isLoggedIn } = require("../loggedInMiddleware");
const multer = require("multer");
const { storage } = require("../cloudinary/cldindex");
const upload = multer({ storage });

router.get("/", async (req, res) => {
  const colabPosts = await Colab.find({});
  res.render("colab/index", { colabPosts });
});

router.get("/new", (req, res) => {
  res.render("colab/new");
});

router.post("/", async (req, res) => {
  const colabNew = new Colab(req.body.colab);
  await colabNew.save();
  res.redirect("/colab");
});

module.exports = router;
