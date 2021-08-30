var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sqlite3 = require("sqlite3").verbose(); // “.verbose()” method allows you to have more information in case of a problem.

// Creating the Express server
var app = express();

// view engine setup, set to ejs
app.set('view engine', 'ejs');

// Configure middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.static('public')); // serve static files in express then e.g. this will work http://localhost:3000/images/firefox-icon.png
app.use(express.urlencoded({ extended: false })); // use the middleware “express.urlencoded()” so that request.body retrieves the posted values
app.use(cookieParser());

// import routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Connection to the SQlite database
const db_name = path.join(__dirname, 'data', 'apptest.db');
console.log("Database full path - " + db_name);
const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'apptest.db'");
});

// Creating covidregister table (identity_number, first_name, last_name, vaccination_date, vaccine_name, vaccine_place)
const sql_create = `CREATE TABLE IF NOT EXISTS covidregister (
  pk INTEGER PRIMARY KEY AUTOINCREMENT,
  identity_number VARCHAR(100) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  vaccination_date VARCHAR(100) NOT NULL,
  vaccine_name VARCHAR(100) NOT NULL,
  vaccine_place VARCHAR(100) NOT NULL
);`;

db.run(sql_create, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful creation of the 'covidregister' table");

  // Database seeding
  const sql_insert = `INSERT INTO covidregister (identity_number, first_name, last_name, vaccination_date, vaccine_name, 
vaccine_place) VALUES
  ('12345', 'John', 'Doe', '23 August 2021', 'Pfizer', '11145'),
  ('67891', 'Bill', 'Gates', '23 August 2021', 'Pfizer', '11146');`;
  db.run(sql_insert, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful creation of 2 covidregister records");
  });
});

// import routes
app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
