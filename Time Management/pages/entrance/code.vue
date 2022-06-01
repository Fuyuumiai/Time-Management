<template>
	<view class="wrap">
		<u-navbar title-color="#000" :title-size="34" :border-bottom="false"  title="验证码登录" />
		<view class="key-input">
			<view class="title">请输入验证码</view>
			<view class="tip">验证码已发送至 <view class="tip-email">{{email}}</view></view>
			<u-message-input :focus="true" :value="value" @finish="finish" mode="bottomLine" :maxlength="maxlength"></u-message-input>
			<text :class="{ error: error }">验证码错误，请重新输入</text>
			<view class="captcha">
				<text :class="{ noCaptcha: show }" @tap="actionSheet">收不到验证码点这里</text>
				<text :class="{ regain: !show }">{{ second }}秒后重新获取验证码</text>
			</view>
		</view>
		<u-action-sheet :list="list" v-model="sheetShow" @click="noCaptcha"></u-action-sheet>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			email: '',
			maxlength: 6,
			value: '',
			second: 60,
			show: false,
			error: false,
			flag: true,
			list: [{
				text: '重新发送验证码'
			}],
			sheetShow: false
		};
	},
	onLoad(options) {
		this.$nextTick(() => {
			this.email = options.email
			this.onSecond()
		})
	},
	methods: {
		onSecond(){
			let id = setInterval(() => {
				this.second--
				if (this.second <= 0) { 
					this.show = true
					clearInterval(id)
				}
			}, 1000)
		},
		actionSheet(){
			if (this.flag) {
				this.sheetShow = true
			}
		},
		// 收不到验证码选择时的选择
		noCaptcha(i) {
			if (this.flag){
				this.flag = false
				this.$apis.getCode({
					to: this.email,
					type: 'email',
					operation: 'mix'
				}).then(res => {
					if (res.data.code === 200) {
						this.$refs.uToast.show({
							title: '发送成功！',
							type: 'success',
							callback: () => {
								this.$nextTick(() => {
									this.show = false
									this.second = 60
									this.onSecond()
								})
							}
						})
					} else {
						this.$refs.uToast.show({
							title: res.data.message,
							type: 'error'
						})
					}
				}).catch(() => {
					this.$refs.uToast.show({
						title: '服务器开小差了~',
						type: 'error'
					})
				}).finally(() => {
					this.flag = true
				})
			}
		},
		// 输入完验证码最后一位执行
		finish(value) {
			if (this.flag) {
				this.flag = false
				this.$apis.checkCode({
					email: this.email,
					value
				}).then(res => {
					if (res.data.code == 200) {
						let info = res.data.data
						if (info.status) {
						   uni.setStorageSync('userId', info.userId)
						   this.$refs.uToast.show({
								title: '验证码核对成功',
								type: 'success',
								callback: ()=> {
									uni.reLaunch({
										url: `/pages/mine/index`
									})
								}
						   })
						} else {
							// 未注册，进入信息录入页面
							uni.navigateTo({
								url: `/pages/entrance/info?email=${this.email}`
							})
						}
					} else {
						this.error = true
						this.$refs.uToast.show({
							title: res.data.message,
							type: 'error'
						})
					}
				}).catch(() => {
					this.error = true
					this.$refs.uToast.show({
						title: '服务器开小差了~',
						type: 'error'
					})
				}).finally(() => {
					this.flag = true
				})
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.wrap {
	padding: 80rpx;
}

.box {
	margin: 30rpx 0;
	font-size: 30rpx;
	color: 555;
}

.key-input {
	padding: 30rpx 0;
	text {
		display: none;
	}
	.error {
		display: block;
		color: red;
		font-size: 30rpx;
		margin: 20rpx 0;
	}
}

.title {
	font-size: 40rpx;
	color: $u-main-color;
}

.key-input .tip {
	font-size: 28rpx;
	color: $u-content-color;
	margin-top: 20rpx;
	margin-bottom: 60rpx;
	.tip-email {
		display: inline;
		color: #000;
		font-weight: bold;
		margin-left: 10rpx;
		word-break:break-all;
	}
}
.captcha {
	color: $u-type-warning;
	font-size: 30rpx;
	margin-top: 40rpx;
	.noCaptcha {
		display: block;
	}
	.regain {
		display: block;
	}
}
</style>
