const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');//Cookie解析的中间件
const logger = require('morgan');
const session = require('express-session')// 回话支持
const Router = require('./routes/index');
const bodyParser = require('body-parser');

const MongoStore = require('connect-mongodb')
const settings = require('./models/settings')

const API = require('./api/index')

const db = require('./models/db')

const app = express();

//app.use(db)

app.use(API)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// view engine setup
app.set('views', path.join(__dirname, 'views')); // 设置为模板相对路径
app.set('view engine', 'jade'); // 设置模板引擎
app.use(cookieParser()); //Cookie解析的中间件
app.use(session({ // 回话支持
  resave: true, //添加 resave 选项
  saveUninitialized: true, //添加 saveUninitialized 选项
  secret:settings.cookieSecret,
  /* store:new MongoStore({ // 把回话信息储存到数据库中以免丢失
    db:settings.db
  }) */
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(Router); // 路由

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
