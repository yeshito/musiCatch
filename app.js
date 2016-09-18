'use strict';
var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');

// neo4j driver code
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "capstone4"));
var session = driver.session();

// routes
var routes = require('./routes/index');
var login = require('./routes/login');
var signup = require('./routes/signup');
var users = require('./routes/users');


var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/login', login);
app.use('/signup', signup)
app.use('/users', users);



// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handlers
//
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.json(err.status || 500 'error', {
//       message: err.message,
//       error: err
//     });
//   });
// }
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500).json('error', {
//     message: err.message,
//     error: {}
//   });
// });


module.exports = app;
