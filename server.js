var app = require('./express');
var express = app.express;
// var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
// require("./utilities/filelist");
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
app.use(session({secret:'process.env.SESSION_SECRET',resave:true,saveUninitialized:true}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
// app.use(session({ secret: process.env.SESSION_SECRET }));


// var connectionString ='assignment';
// var mongoose = require("mongoose");
// mongoose.connect(connectionString);

app.use(express.static(__dirname + '/public'));

require("./test/app.js")(app);
require("./server/app.js")(app);

var port = process.env.PORT || 3000;

app.listen(port);