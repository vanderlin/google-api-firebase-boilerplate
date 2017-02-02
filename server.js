var config = require('./config');
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
var history = require('connect-history-api-fallback');

if (!process.env.NODE_ENV) process.env.NODE_ENV = config.dev.env.NODE_ENV

// create the express app
var app = express();
app.use(history());

app.all('*', function(req, res, next) {
     var origin = req.get('origin'); 
     res.header('Access-Control-Allow-Origin', origin);
     res.header("Access-Control-Allow-Headers", "X-Requested-With");
     res.header('Access-Control-Allow-Headers', 'Content-Type');
     next();
})

app.use(express.static(path.join(__dirname, 'dist'))); //  "public" off of current is root

app.get('*', function(req,res){
	res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

// kick of the app
var port = process.env.PORT || 5000;
app.listen(port);

console.log(`Node Env: ${process.env.NODE_ENV}`);
console.log(`server started on port: ${port}`);