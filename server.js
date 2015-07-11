var express = require('express');
var app = express();
var path = require('path')

app.set('views', './views')
app.set('view engine', 'jade');

app.get('/', function(req, res){
	res.render('content');
});

app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(3000, function(){
	console.log('Everything is fine');
});