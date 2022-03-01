const mongoose = require('mongoose');
const express = require('express');
const methodOverride = require('method-override')
const path = require('path');
const Blog = require('./models/blog');

mongoose.connect('mongodb://127.0.0.1:27017/wageTeam',{
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>{
	console.log("Database connected");
});

const app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'views/pages', 'index.html'));
});

app.get('/gallery', function(req, res) {
	res.sendFile(path.join(__dirname, 'views/pages', 'gallery.html'));
});
app.get('/harta', function(req, res) {
	res.sendFile(path.join(__dirname, 'views/pages', 'harta.html'));
});

app.get('/blog', async(req, res) => {
	const blogPosts = await Blog.find({});
	res.render('blog/index', {blogPosts});
});
app.get('/blog/new', (req,res) =>{
	res.render('blog/new');
});

app.post('/blog', async(req,res) =>{
	const blogNew = new Blog(req.body.blog);
	await blogNew.save();
	res.redirect(`/blog/${blogNew._id}`)
});

app.get('/blog/:id', async(req,res) =>{
	const blogID = await Blog.findById(req.params.id)
	res.render('blog/show', {blogID});
});

app.get('/blog/:id/edit', async(req,res) =>{
	const blogID = await Blog.findById(req.params.id)
	res.render('blog/edit', {blogID});
});

app.put('/blog/:id',async(req,res) =>{
	const {id} = req.params;
	const blogEdited = await Blog.findByIdAndUpdate(id,{...req.body.blog});
	res.redirect(`/blog/${blogEdited._id}`)
});

app.delete('/blog/:id', async(req,res) =>{
	const { id } = req.params;
	await Blog.findByIdAndDelete(id);
	res.redirect('/blog');
});




var port = process.env.PORT || 3000;
app.listen(port)
console.log('Server is listening on port', port)
