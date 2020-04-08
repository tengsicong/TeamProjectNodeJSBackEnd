const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const config = require('config-lite')(__dirname);
const routes = require('./routes');
const pkg = require('./package');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'shijieshangzh!y0uwand0ngsenhebuwand0ngsenderen',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60 * 60 * 1000},
    store: new MongoStore({
        url: config.mongodb,
    }),
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/role_select', require('./routes/role_select'));
app.use('/signin', require('./routes/signin'));
app.use('/signout', require('./routes/signout'));
app.use('/signup', require('./routes/signup'));
app.use('/account', require('./routes/account'));
app.use('/student', require('./routes/student'));
app.use('/client', require('./routes/client'));
app.use('/admin', require('./routes/admin'));
app.use('/staff', require('./routes/staff'));

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
