'use strict';
const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const request = require('request');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();
require('dotenv').load()

// Create a session with express-session
// const exprSession = require('express-session');
//Configure it to use redis - this means our sessions continue to exist after we restart the server
// var redisStore = require('connect-redis')(exprSession);
//Get a reference to redis
// const redisClient = require('./db/redis');
// const kue = require('kue');
// const artist_id = require('./queue/artist_id');

// neo4j driver code
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "capstone4"));
const session = driver.session();
// routes
const routes = require('./routes/index');
const login = require('./routes/login');
const signup = require('./routes/signup');
const users = require('./routes/users');
const upload = require('./routes/upload');
const dashboard = require('./routes/dashboard');

const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(exprSession({
//   secret: process.env.SESSION_SECRET,
//   store: new redisStore({client: redisClient}),
//   resave: true,
//   saveUninitialized: true
// }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: [
        process.env.SESSION_KEY1,
        process.env.SESSION_KEY2,
        process.env.SESSION_KEY3
      ]}))

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/login', login);
app.use('/signup', signup)
app.use('/users', users);
app.use('/upload', upload);
app.use('/dashboard', dashboard);

// kue
// app.use('/queue', kue.app);
// app.use('/artist_id', artist_id);


module.exports = app;
