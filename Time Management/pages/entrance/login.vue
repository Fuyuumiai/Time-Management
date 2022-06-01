<template>
	<view class="wrap">
		<u-navbar :background="{ backgroundColor: '#fff' }" :border-bottom="false" ></u-navbar>
		<view class="content">
			<view class="title">
				<text>{{title}}</text>
			</view>
			<view class="input">
				<u-input
					v-model="email"
					type="text"
					placeholder="输入您的邮箱"
					:clearable="false"
					:focus="true"
					input-align="center"
					:custom-style="inputStyle"/>
				<view class="tip">
					<text>未注册的邮箱号验证后自动创建账号</text>
				</view>
			</view>
			<view class="btn">
				<u-button type="primary" :loading="!flag" shape="circle" :custom-style="btnStyle" @click="handleSubmit">{{btnText}}</u-button>
			</view>
			<view class="hint">
				登录即代表同意<text class="hint-link" @click="handleUserTip">用户协议</text>
			</view>
		</view>
		<u-modal v-model="tipShow" title="用户协议" :content="userTip"></u-modal>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: '欢迎来到渡春秋',
			inputStyle: {
				height: '100rpx',
				borderRadius: '50rpx',
				marginBottom: '5rpx',
				backgroundColor: '#f1f1f1',
				fontSize: '34rpx'
			},
			btnStyle: {
				height: '100rpx',
				borderRadius: '50rpx'
			},
			flag: true,
			btnText: '获取验证码',
			email: '',
			tipShow: false,
			userTip: `
				本软件制作中，之后在整用户协议吧。
			`
		}
	},
	computed: {
	},
	methods: {
		// 打开用户协议
		handleUserTip(){
			this.tipShow = true
		},
		// 提交邮箱
		handleSubmit() {
			if(this.$u.test.email(this.email)) {
				if (this.flag) {
					this.btnText = '发送中...'
					this.flag = false
					this.$apis.getCode({
						to: this.email,
						type: 'email',
						operation: 'mix'
					}).then(res => {
						if (res.data.code === 200) {
							this.$refs.uToast.show({
								title: res.data.message,
								type: 'success',
								url: `/pages/entrance/code?email=${this.email}`
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
						this.btnText = '获取验证码'
					})
				}
			} else {
				this.email = ''
				this.$refs.uToast.show({
					title: '邮箱格式错误',
					type: 'error',
					duration: 1700
				})
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.wrap {
	height: 100vh;
	padding: 0 100rpx;
	position: relative;
	.content {
		margin-top: 120rpx;
		.title {
			color: $u-content-color;
			font-size: 46rpx;
			font-weight: bold;
			text-align: center;
			letter-spacing: 2rpx;
		}
		.input {
			margin-top: 140rpx;
			.tip {
				margin-top: 20rpx;
				color: $u-tips-color;
				font-size: 26rpx;
				text-align: center;
			}
		}
		.btn {
			margin-top: 70rpx;
		}
	}
	.hint {
		width: calc(100% - 200rpx);
		position: absolute;
		bottom: 20rpx;
		color: $u-tips-color;
		font-size: 26rpx;
		text-align: center;
		letter-spacing: 1rpx;
		.hint-link {
			text-decoration: underline;
			margin-left: 10rpx;
		}
	}
}
</style>
