// 默认url
const baseUrl = `http://localhost:4215`

// 普通请求
function  $request(url, method, data, config){
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${baseUrl}/${url}`,
			header: {
				 'Content-Type': 'application/json;charset=UTF-8'
			},
			timeout: 15000,
			method,
			data,
			...config,
			success: (data) => {
				resolve(data)
			},
			fail: (error) => {
				reject(error)
			}
		})
	})
}

// 上传文件请求
function $upload(url, data) {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: `${baseUrl}/${url}`,
			...data,
			success: (data) => {
				resolve(data)
			},
			fail: (error) => {
				reject(error)
			}
		})
	})
}


// 导出接口
export default {
	baseUrl,
	// 获取验证码
	getCode(data) {
		return $request('user/sendCode', 'post', data)
	},
	// 校验验证码
	checkCode(data) {
		return $request('user/checkCode', 'post', data)
	},
	// 上传头像
	uploadAvatar(data) {
		return $upload('upload/uploadAvatar', data)
	},
	// 创建新用户
	createUser(data) {
		return $request('user/createUser', 'post', data)
	},
	// 获取用户信息
	getUserInfo(data) {
		return $request('user/getUserInfo', 'get', data)
	},
	getRecordInfo(data) {
		return $request('user/getRecordInfo', 'get', data)
	},
	// 修改用户信息
	upDataUserInfo(data){
		return $request('user/upDataUserInfo', 'post', data)
	},
	// 创建新目标
	createTarget(data) {
		return $request('target/createTarget', 'post', data)
	},
	// 修改目标
	upDataTarget(data) {
		return $request('target/upDataTarget', 'post', data)
	},
	// 获取指定类型所有目标
	queryTypeTarget(data) {
		return $request('target/queryTypeTarget', 'post', data)
	},
	// 根据日期获取目标的执行记录
	queryDateInfo(data) {
		return $request('target/queryDateInfo', 'post', data)
	},
	// 获取指定ID目标
	getTargetById(data) {
		return $request('target/getTargetById', 'query', data)
	},
	queryTargetByParm(data) {
		return $request('target/queryTargetByParm', 'post', data)
	},
	// 删除目标
	deleteTarget(data) {
		return $request('target/deleteTarget', 'get', data)
	},
	// 创建任务
	createPlan(data) {
		return $request('plan/createPlan', 'post', data)
	},
	// 修改任务
	upDataPlan(data) {
		return $request('plan/upDataPlan', 'post', data)
	},
	// 更新任务循环状态
	upDataRepeat(data) {
		return $request('plan/upDataRepeat', 'post', data)
	},
	// 查询今日任务
	getToDayPlan(data) {
		return $request('plan/getTodayPlan', 'get', data)
	},
	// 根据条件查询任务
	getVarietyPlan(data) {
		return $request('plan/getVarietyPlan', 'post', data)
	},
	// 根据分页查询所有任务
	getAllPlan(data) {
		return $request('plan/getAllPlan', 'post', data)
	},
	// 根据ID获取任务
	getPlanById(data) {
		return $request('plan/getPlanById', 'get', data)
	},
	// 根据ID获取详细任务信息
	getDetailPlanById(data) {
		return $request('plan/getDetailPlanById', 'get', data)
	},
	// 创建每日总结
	createSummary(data) {
		return $request('summary/createSummary', 'post', data)
	},
	// 获取指定日期的总结的任务列表
	querySummaryTask(data) {
		return $request('summary/querySummaryTask', 'get', data)
	},
	// 判断指定日期是否创建每日总结
	judgeExist(data) {
		return $request('summary/judgeExist', 'get', data)
	},
	// 判断是否有未总结日期
	haveNotSign(data) {
		return $request('summary/haveNotSign', 'get', data)
	},
	// 获取每日一句
	getTodaySoup(data) {
		return $request('soup/getTodaySoup', 'get', data)
	},
	// 获取当地天气信息
	getTodayCityWeather(data) {
		return $request('weather/getTodayCityWeather', 'get', data)
	},
	// 获取历史的今天
	getTodayHistory(data) {
		return $request('history/getTodayHistory', 'get', data)
	},
	// 获取历史的今天所有
	getTodayAllHistory(data) {
		return $request('history/getTodayAllHistory', 'get', data)
	},
	// 获取指定日期总结
	querySummary(data) {
		return $request('summary/querySummary', 'get', data)
	},
	// 获取总结的起始日期
	getStartDate(data) {
		return $request('summary/getStartDate', 'get', data)
	},
	// 更新总结
	upDataSummary(data) {
		return $request('summary/upDataSummary', 'post', data)
	},
	// 获取统计信息
	queryRangeSummary(data) {
		return $request('summary/queryRangeSummary', 'get', data)
	},
	// 提交反馈
	submitFeedBack(data) {
		return $request('feed/submitFeedBack', 'post', data)
	}
}