var express = require('express'),
	app = express();
const path = require('path');

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'views/pages', 'index.html'));
});


app.get('/blog', function(req, res) {
	res.sendFile(path.join(__dirname, 'views/pages', 'blog.html'));
});
app.get('/gallery', function(req, res) {
	res.sendFile(path.join(__dirname, 'views/pages', 'gallery.html'));
});
app.get('/harta', function(req, res) {
	res.sendFile(path.join(__dirname, 'views/pages', 'harta.html'));
});


var port = process.env.PORT || 3000;
app.listen(port)
console.log('Server is listening on port', port)
