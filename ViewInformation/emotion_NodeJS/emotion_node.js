var express = require('express');
var app = express();

var router = require('./router/main')(app);

app.set('views', './');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(8091,function() {
	console.log("server started on 8091");
});

