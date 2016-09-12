process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose    = require('./config/mongoose');
var express     = require('./config/express');
var passport    = require('./config/passport');

var db      = mongoose();
var passport= passport();
//var app       = express(); 
var app     = express(db);

app.listen(3000);
module.exports = app;

console.log('server running at http://localhost:3000');