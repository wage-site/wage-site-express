const mongoose = require('mongoose');
const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const Blog = require('./models/blog');
const blogRoute = require('./routes/blogRoute');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


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
const sessionConfig = {
	secret:'addsecret',
	resave:false,
	saveUninitialized:true,
	cookie:{
		httpOnly:true,
		expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge:  1000 * 60 * 60 * 24 * 7
	}
}
app.use(session(sessionConfig));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'views/pages', 'index.html'));
});

app.get('/gallery', function(req, res) {
	res.sendFile(path.join(__dirname, 'views/pages', 'gallery.html'));
});
app.get('/harta', function(req, res) {
	res.sendFile(path.join(__dirname, 'views/pages', 'harta.html'));
});

//Creeaza conturi noi!

 app.get('/register', async(req,res) =>{
	const user = new User({email:'reporter1@wage.com', username:'reporter'});
	const newUser = await User.register(user, 'newwage22');
	console.log(newUser);
	res.redirect('/blog');
}); 

app.get('/dummy', (req,res) =>{
	res.render('pages/login')
});

app.post('/dummy', passport.authenticate('local'),(req,res)=>{
	res.redirect('/blog')
});

app.use('/blog', blogRoute)

var port = process.env.PORT || 3000;
app.listen(port)
console.log('Server is listening on port', port)
