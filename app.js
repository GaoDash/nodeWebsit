var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');

//加载数据库mongoose
var mongoose = require('mongoose');
//引入session模块
var session = require('express-session');

var router = require('./routes/router');
var admin = require('./routes/admin-router');

var app = express();	//生成一个express实例 app

// view engine setup
app.set('views', path.join(__dirname, 'views')); //设置 views 文件夹为存放视图文件的目录
app.set('view engine', 'ejs');	//设置视图模板引擎为 ejs
//app.engine("html",require("ejs").__express); // or   app.engine("html",require("ejs").renderFile);
//app.set('view engine', 'html');

global.dbHandle = require('./database/dbHandle');
global.db = mongoose.connect('mongodb://127.0.0.1:27017/nodedb');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));	//加载日志中间件
app.use(bodyParser.json());	//加载解析json的中间件
app.use(bodyParser.urlencoded({ extended: false }));	//加载解析urlencoded请求体的中间件。
app.use(cookieParser());	//加载解析cookie的中间件
app.use(express.static(path.join(__dirname, 'public')));	//设置public文件夹为存放静态文件的目录。

//session处理
app.use(session({
	secret: 'secret',	//Cookie 加密
	cookie: {
		maxAge: 1000*60*60*24*30	//30 days
	}
}));

//使用flash
app.use(flash());

//设置flash session
app.use(function(req,res,next){
	res.locals.user = req.session.user; //session中获取user对象在页面能够直接获取
	res.locals.infors = req.flash('infor');

	next();
});

app.use('/', router);		//路由控制器
app.use('/admin', admin);		//路由控制器

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
