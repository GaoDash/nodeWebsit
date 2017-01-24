var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var ueditor = require("ueditor");
var settings = require("./settings");

//加载数据库mongoose
var mongoose = require('mongoose');
//引入session模块
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var router = require('./routes/router');
var admin = require('./routes/admin-router');

var app = express();	//生成一个express实例 app

// view engine setup
app.set('views', path.join(__dirname, 'views')); //设置 views 文件夹为存放视图文件的目录
app.set('view engine', 'ejs');	//设置视图模板引擎为 ejs
//app.engine("html",require("ejs").__express); // or   app.engine("html",require("ejs").renderFile);
//app.set('view engine', 'html');

global.dbHandle = require('./database/dbHandle');
global.db = mongoose.connect(settings.url);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));	//加载日志中间件
app.use(bodyParser.json());	//加载解析json的中间件
app.use(bodyParser.urlencoded({ extended: false }));	//加载解析urlencoded请求体的中间件。
app.use(cookieParser());	//加载解析cookie的中间件
app.use(express.static(path.join(__dirname, 'public')));	//设置public文件夹为存放静态文件的目录。

//session处理
app.use(session({
	secret: settings.cookieSecret,	//Cookie 加密
  key: settings.db,
	cookie: {maxAge: 1000*60*60},  //1 hour
  store: new MongoStore({       //cookie信息保存在DB中，用处暂不清楚
    /*db: settings.db,
    host: settings.host,
    port: settings.port*/
    url: settings.url
  })
}));

//使用flash
app.use(flash());

//设置flash session
app.use(function(req,res,next){
	res.locals.user = req.session.user; //session中获取user对象在页面能够直接获取
	res.locals.infor = req.flash('infor').toString();

	next();
});

//富文本编辑器中间件
app.use("/tools/ueditor/ue", ueditor(path.join(__dirname, 'public'), function (req, res, next) {
    //客户端上传文件设置
    var ActionType = req.query.action;
    console.log('---------------------------------------ActionType:'+ActionType);
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        var file_url = '/uploads/ueditor/img';//默认图片上传地址
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = '/uploads/ueditor/file'; //附件
        }
        if (ActionType === 'uploadvideo') {
            file_url = '/uploads/ueditor/video'; //视频
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    //  客户端发起图片列表请求
    else if (ActionType === 'listimage') {
        var dir_url = '/images/ueditor/';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/tools/ueditor/ueditor.config.json');
    }
}));

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
