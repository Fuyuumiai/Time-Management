<template>
	<view class="wrap">
		<u-navbar :background="{ backgroundColor: '#fff' }" title-color="#303133" title-size="30" :border-bottom="false"  title="问题反馈"></u-navbar>
		
		<view class="content">
			<view class="card">
				<view class="line">
					<view class="line-item">
						<u-icon class="item-icon" name="info-circle" color="#909399" size="34"></u-icon>
						<text class="item-label">我们将在您提交后1~3的工作日内给您回复。</text>
					</view>
				</view>
			</view>
			<view class="card">
				<view class="title">
					<text>反馈信息</text>
				</view>
				<view class="line-item">
					<u-input v-model="content" type="textarea" placeholder="请输入您的反馈信息."  height="200" maxlength="200" :auto-height="false" />
				</view>
			</view>
			<u-button :hairLine="false" type="primary" shape="circle" @click="submitFeedBack">提 交</u-button>
		</view>
		<u-toast ref="uToast"/>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				content: ''
			};
		},
		computed: {
			...mapGetters(['userId'])
		},
		methods: {
			submitFeedBack() {
				if (this.length === 0) {
					return this.$refs.uToast.show({
						title: '反馈信息为空！',
						type: 'error'
					})
				}
				if (!this.userId) {
					return this.$refs.uToast.show({
						title: '用户未登录！',
						type: 'error'
					})
				}
				this.$apis.submitFeedBack({
					userId: this.userId,
					content: this.content
				}).then(({data}) => {
					if (data.code === 200) {
						this.$refs.uToast.show({
							title: '操作成功！',
							type: 'success',
							callback: ()=> {
								uni.navigateBack()
							}
						})
					} else {
						this.$refs.uToast.show({title: data.message})
					}
				}).catch(err => {
					this.$refs.uToast.show({title: '服务器开小差了'})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		height: 100vh;
		background-color: #fafafa;
		position: relative;
		.content {
			padding: 30rpx 25rpx;
		}
	}
	.card {
		width: 100%;
		padding: 30rpx 25rpx;
		margin-bottom: 25rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, 0.1);
		.null {
			width: 100%;
			height: 120rpx;
			line-height: 120rpx;
			color: #909399;
			text-align: center;
		}
		.title {
			font-size: 30rpx;
			color: #303133;
			font-weight: bold;
			margin-bottom: 12rpx;
		}
		.line {
			display: flex;
			margin-bottom: 20rpx;
			&-item {
				flex: 1;
				.item-tip {
					color: #909399;
				}
				.item-text {
					color: #303133;
					font-weight: bold;
				}
				.item-icon {
					vertical-align: middle;
					margin-right: 6rpx;
				}
				.item-label {
					font-size: 26rpx;
					color: #909399;
				}
			}
		}
		.line:last-of-type {
			margin-bottom: 0rpx;
		}
	}
	::v-deep .u-btn--default {
		color: #606266;
		border-color: #c0c4cc;
		background-color: #ffffff;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}
	::v-deep .u-btn--bold-border {
		border: 0px solid #ffffff;
	}
	::v-deep .u-size-default {
		height: 80rpx;
		line-height: 80rpx;
	}
	::v-deep .u-btn--primary {
		background-color: #409EFF;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}
</style>
