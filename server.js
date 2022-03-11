if(process.env.NODE_ENV !=="production")
{
	require('dotenv').config();
}

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
const Sanitize = require('express-mongo-sanitize');
const helmet = require('helmet')

let mongoUrl = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@wagedb.vhhps.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(mongoUrl,{
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
app.use(Sanitize());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dwshqh6op/",
    "https://ajax.googleapis.com/",
    "https://ajax.googleapis.com/ajax",
    "https://unpkg.com/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dwshqh6op/",
    "https://cdnjs.cloudflare.com/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/dwshqh6op/",
    "https://data.uradmonitor.com/"
];
const fontSrcUrls = [ 
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com/",
    "https://cdnjs.cloudflare.com/"

];
 
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${process.env.CLOUD_NAME}/`, 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
const sessionConfig = {
	name:'mksid',
	secret:'addsecret',
	resave:false,
	saveUninitialized:true,
	cookie:{
		httpOnly:true,
		/* secure:true, -turn on on deployment */
		expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge:  1000 * 60 * 60 * 24 * 7
	}
}
app.use(session(sessionConfig));


app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
 
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) =>{
	res.locals.currentUser = req.user;

	next();
});

app.get('/', async(req, res) =>{
    const blogPosts = await Blog.find({});
    let templatePosts = [];
    blogPosts.forEach((post) => {
        templatePosts.push(post.toObject())
    });
	res.render('pages/index',{blogPosts: [...templatePosts]})
});

app.get('/colab', function(req, res) {
	res.sendFile(path.join(__dirname, 'views/pages', 'colab.html'));
});
app.get('/harta', function(req, res) {
	res.sendFile(path.join(__dirname, 'views/pages', 'harta.html'));
});

//conturi noi!

app.get('/reg', (req,res) =>{
	res.render('pages/register')
});

app.post('/reg', async(req,res) =>{
	try {
	const {email,username,password} = req.body;
	const userNew = new User({email,username});
	const registeredUser = await User.register(userNew,password);
	res.redirect('/blog');
	} catch(e){
		console.log(e.message);
		res.redirect('/reg');
	}
});

app.get('/dummy', (req,res) =>{
	res.render('pages/login')
});

app.post('/dummy', passport.authenticate('local', {failureRedirect: "/dummy"}),(req,res)=>{
	res.redirect("/blog");
});

app.get('/logout',(req,res) =>{
	req.logout();
	res.redirect('/');
});

app.use('/blog', blogRoute)

var port = process.env.PORT || 3000;
app.listen(port)
console.log('Server is listening on port', port)
