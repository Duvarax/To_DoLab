var createError = require('http-errors');
const passport = require('passport');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');




var usuarioRouter = require('./routes/usuario');
var listaRouter = require('./routes/lista');
var tareasRouter = require('./routes/tareas');
var app = express();
var methodOverride = require('method-override')
var session = require('express-session');
var control = require('./middleware/sessionControl');
app.use(session({
  secret: 'duvara tp',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'))

app.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});




app.use('/listas',control.autenticado, listaRouter);
app.use('/tareas',control.listaSeleccionada, tareasRouter);
app.use('/', usuarioRouter);


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

app.listen(8888);

module.exports = app;
