var express = require('express');
var router = express.Router();

var moment = require('moment');

/* GET dashboard listing. */
router.get('/', checkLogin).get('/', function(req, res) {
	res.render('admin/dashboard', { title: 'dashboard',uploadUrl:'/admin/EditPortrait' });
});

/* GET 留言列表 listing. */
router.get('/messages', checkLogin).get('/messages',function(req, res) {
	var Messages = global.dbHandle.getModel('message'),
		rows = 5,
		totalRows = 1,
		totalPages = 1,
		curPage = Number(req.query.page)||1;	//get使用query获取参数，默认为1

	//分页查询
	var query = Messages.find({});	//如果不提供回调函数，所有这些方法都返回 Query 对象
	query.skip((curPage-1) * rows);
	query.limit(rows);
	query.sort({"create_at": -1});

	//计算分页数据
	query.exec(function(err, docs){
		if(err){
			res.send(err);
			console.log("err"+err);
		}
		else{
			//计算总页数
			Messages.count(function(err, rs){
				if(err){
					console.log(err);
				}
				else
				{
					var totalRows = rs,	//总条目数量
						totalPages = Math.ceil(rs/rows);	//总页数

					//格式化输出结果
					docs.forEach(function(doc){
						doc.create_at_string = moment(doc.create_at).format('YYYY-MM-DD');	//日期格式化
					});
					res.render('admin/messages', 
					{	
						title: 'messages',
						pageHeader: '留言列表' ,
						totalRows: totalRows,
						totalPages: totalPages,	
						curPage: curPage,
						isFirstPage: curPage==1,
						isLastPage: curPage==totalPages,
						data: docs //数据集合
					});
				}
			});
		}
	});
});

/* GET 联系方式 listing. */
router.get('/contacts', checkLogin).get('/contacts', function(req, res){
	var ContactsInfor = global.dbHandle.getModel('contactsInfor');
	ContactsInfor.findOne(function(err, doc){
		if(err){
			console.log(err);
		}
		else{
			console.log(doc);
			res.render('admin/contacts', 
			{ 
				title: 'contacts',
				pageHeader: '联系信息维护',
				data: doc
			});
		}
	});
}).post('/contacts', function(req, res){
	var ContactsInfor = global.dbHandle.getModel('contactsInfor'),
		telNo = req.body.telNo,
		qq = req.body.qq,
		wechat = req.body.wechat,
		email = req.body.email,
		address = req.body.address;

	//执行更新DB，如果不存在文档则创建
	ContactsInfor.update({},{'tel_no':telNo,'qq':qq,'wechat':wechat,'email':email,'address':address},{upsert:true},function(err, numberAffected){
		if(err){
			res.send(500);	//表示失败
			console.log(err);
		}
		else{
			res.send(200);	//表示提交成功
			console.log('update ok!影响行数：'+numberAffected);
		}
	});
});

/*GET 公司简介 */
router.get('/profile', checkLogin).get('/profile', function(req, res){
	var ComFile = global.dbHandle.getModel('companyProfile');
	ComFile.findOne(function(err, doc){
		if(err){
			console.log(err);
		}
		else{
			res.render('admin/profile', { title: 'profile',pageHeader: '简介内容维护',data: doc});
		}
	});
}).post('/profile', function(req, res){
	var ComFile = global.dbHandle.getModel('companyProfile'),
		content = req.body.content;

	//执行更新DB，如果不存在文档则创建
	ComFile.update({}, {'contents': content},{upsert:true},function(err){
		if(err){
			res.send(500);	//表示失败
			console.log(err);
		}
		else{
			res.send(200);	//表示提交成功
		}
	});
});

/* GET 登录页面 */
router.get('/login', function(req, res) {
	res.render('admin/login', {});
}).post('/login', function(req, res){
	var User = global.dbHandle.getModel('user'),
		uname = req.body.uname,
		upwd = req.body.upwd;

	User.findOne({name: uname}, function(err, doc){
		if(err){
			res.send(500);
			console.log(err);
		}
		else if(!doc){
			req.flash('infor', '用户不存在!'); 
			return res.redirect('./login');//用户不存在则跳转到登录页
		}
		else{
			if(doc.password !== upwd){
				req.flash('infor', '密码错误!'); 
				return res.redirect('./login');//用户不存在则跳转到登录页
			}else{
				console.log(doc);
				req.session.user = doc;	//信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
				req.flash('infor', '登录成功!'); 
				return res.redirect('/admin');
			}
		}
	});
});

/* logout 退出*/
router.get('/logout', function(req,res){
	req.session.user = null;
	req.flash('infor', '登出成功！');
	res.redirect('/');	//登出成功后跳转到主页
});

/*检查登录状态*/
function checkLogin(req, res, next){
	if(!req.session.user) {
		return res.redirect('/admin/login');	//return 表示不执行next();
	}
	next();
}

module.exports = router;
