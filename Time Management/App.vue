<script>
	export default {
		// 首次加载
		onLaunch: function() {
			let userId = uni.getStorageSync('userId')
			if (!userId) {
				uni.reLaunch({
					url: '/pages/mine/nologin'
				})
			}
		},
		// 显示触发
		onShow: function() {
		},
		// 隐藏触发
		onHide: function() {}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	/* uview-ui css */
	@import "components/uview-ui/index.scss";
</style>
