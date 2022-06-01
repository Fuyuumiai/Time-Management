// 用户基础信息
const state = {
	userId: uni.getStorageSync('userId')
}

export default {
	namespaced: true,
	state
}
