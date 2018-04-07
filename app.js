var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sqlTest = require('./routes/sqlTest');
var signup = require('./routes/signup');
var validate = require('./routes/validate');
var addPlant = require('./routes/addPlant');
var getPlants = require('./routes/getPlants');
var removePlant = require('./routes/removePlant');
var getPlantTypes = require('./routes/getPlantTypes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/sqlTest', sqlTest);
app.use('/users', usersRouter);
app.use('/signup', signup);
app.use('/validate', validate);
app.use('/addPlant', addPlant);
app.use('/getPlants', getPlants);
app.use('/removePlant', removePlant);
app.use('/getPlantTypes', getPlantTypes);

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

/* routes requests to correct scripts */