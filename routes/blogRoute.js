const express = require('express')
const router = express.Router();
const Blog = require('../models/blog');
const methodOverride = require('method-override')

router.get('/', async(req, res) => {
	const blogPosts = await Blog.find({});
	res.render('blog/index', {blogPosts});
});
router.get('/new', (req,res) =>{
	res.render('blog/new');
});

router.post('/', async(req,res) =>{
	const blogNew = new Blog(req.body.blog);
	await blogNew.save();
	res.redirect(`/blog/${blogNew._id}`)
});

router.get('/:id', async(req,res) =>{
	const blogID = await Blog.findById(req.params.id)
	res.render('blog/show', {blogID});
});

router.get('/:id/edit', async(req,res) =>{
	const blogID = await Blog.findById(req.params.id)
	res.render('blog/edit', {blogID});
});

router.put('/:id',async(req,res) =>{
	const {id} = req.params;
	const blogEdited = await Blog.findByIdAndUpdate(id,{...req.body.blog});
	res.redirect(`/blog/${blogEdited._id}`)
});

router.delete('/:id', async(req,res) =>{
	const { id } = req.params;
	await Blog.findByIdAndDelete(id);
	res.redirect('/blog');
});

module.exports = router;