var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET xx首页 page. */
router.route('/').get(function(req, res) {
	res.render('home', { title: 'xx首页' });
});

/* GET 新闻动态 page. */
router.route('/news').get(function(req, res) {
	res.render('news', { title: '新闻动态' });
});

/* GET 公司简介 page. */
router.route('/profile').get(function(req, res) {
	res.render('profile', { title: '公司简介' });
});

/* GET 联系我们 page. */
router.route('/contact').get(function(req, res) {
	var ContactsInfor = global.dbHandle.getModel('contactsInfor');
	ContactsInfor.findOne(function(err, doc){
		if(err){
			console.log(err);
		}
		else{
			console.log(doc);
			res.render('contact', 
			{ 
				title: '联系我们',
				pageHeader: '联系信息维护',
				data: doc
			});
		}
	});
}).post(function(req, res){
	var Message = global.dbHandle.getModel('message'),
		uname = req.body.uname,
		utel = req.body.utel,
		uemail = req.body.uemail,
		ucontent = req.body.ucontent;
	//执行插入DB
	Message.create({
		name: uname,
		tel: utel,
		email: uemail,
		content: ucontent,
		date: new Date()
	},function(err, doc){
		if(err){
			res.send(500);
			req.flash('infor', err);
		}
		else{
			res.send(200,'success');
			req.flash('infor', '提交成功');
		}
	});

});


module.exports = router;
