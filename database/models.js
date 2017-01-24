module.exports = {
	//管理员用户
	user:{
		name: {type:String,required:true},
		password: {type:String,required:true},
		update_at: {type: Date,default: Date.now}
	},
	//留言信息表
	message: {
		name: {type: String,required: true, index:true},
		tel: {type: String,required: true},
		email: String,
		content: {type: String,required: true},
		create_at: {type: Date,default: Date.now}
	},
	//公司联系信息表
	contactsInfor: {
		tel_no: String,
		qq: String,
		wechat: String,
		email: String,
		address: String
	},
	//公司简介
	companyProfile: {
		logo: String,
		contents: String
	}
}