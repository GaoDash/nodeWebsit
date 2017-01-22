var express = require('express');
var router = express.Router();

var moment = require('moment');

/* GET dashboard listing. */
router.get('/', function(req, res) {
	res.render('admin/dashboard', { title: 'dashboard' });
});

/* GET 留言列表 listing. */
router.get('/messages',function(req, res) {
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
router.get('/contacts', function(req, res){
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
router.get('/profile', function(req, res){
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

/* GET users listing. */
router.get('/login', function(req, res) {
  res.render('admin/login', {});
});

module.exports = router;
