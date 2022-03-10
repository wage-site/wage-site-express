const express = require('express')
const router = express.Router();
const Blog = require('../models/blog');
const methodOverride = require('method-override')
const {isLoggedIn} = require('../loggedInMiddleware');
const multer = require('multer');
const {storage} = require('../cloudinary/cldindex');
const blog = require('../models/blog');
const upload = multer({ storage });

router.get('/', async(req, res) => {
	const blogPosts = await Blog.find({});
	res.render('blog/index', {blogPosts});
});

router.get('/new',isLoggedIn, (req,res) =>{
	res.render('blog/new'); 
});

router.post('/', isLoggedIn , upload.array('image'), async(req,res) =>{
	const blogNew = new Blog(req.body.blog);
	blogNew.image = req.files.map(f =>({url:f.path, filename:f.filename}))
	await blogNew.save();
	res.redirect(`/blog/${blogNew._id}`)
});

router.get('/:id', async(req,res) =>{
	const blogID = await Blog.findById(req.params.id)
	res.render('blog/show', {blogID});
});

router.get('/:id/edit', isLoggedIn,async(req,res) =>{
	const blogID = await Blog.findById(req.params.id)
	res.render('blog/edit', {blogID});
});

router.put('/:id',isLoggedIn,async(req,res) =>{
	const {id} = req.params;
	const blogEdited = await Blog.findByIdAndUpdate(id,{...req.body.blog});
	res.redirect(`/blog/${blogEdited._id}`)
});

router.delete('/:id',isLoggedIn, async(req,res) =>{
	const { id } = req.params;
	await Blog.findByIdAndDelete(id);
	res.redirect('/blog');
});

module.exports = router;