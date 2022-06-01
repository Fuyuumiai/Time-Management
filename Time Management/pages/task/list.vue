<template>
	<view class="wrap">
		<u-navbar :background="{ backgroundColor: '#ffffff' }"  :border-bottom="false" title="目标列表"></u-navbar>
		<u-gap height="12" bg-color="#fafafa"></u-gap>
		<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="queryTask()">
			<task-manage :taskArray="taskArr" @detachPlan="detachPlan" v-if="taskArr.length"></task-manage>
			<u-loadmore v-if="taskArr.length" :status="taskQuery.status" margin-top="30" :loadText="loadText" />
		</scroll-view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import taskManage from '@/components/task-card/manage.vue'
	export default {
		data() {
			return {
				taskArr: [],
				taskQuery: {
					page: 1,
					num: 5,
					next: true,
					status: 'loadmore'
				},
				loadText: {
					loadmore: '上拉加载更多',
					loading: '努力加载中',
					nomore: '暂无更多内容'
				}
			}
		},
		computed: {
			...mapGetters(['userId'])
		},
		components: {
			taskManage
		},
		onLoad() {
			this.queryTask()
		},
		methods: {
			routeTo(path, params = {}, type = 'navigateTo') {
				// 使用uView的跳转（传参数方便）
				this.$u.route({
					type,
					url: `pages/${path}`,
					params
				})
			},
			queryTask() {
				if (!this.taskQuery.next) {
					return false
				}
				this.taskQuery.status = 'loading'
				
				this.$apis.getAllPlan({
					userId: this.userId,
					page: this.taskQuery.page,
					num: this.taskQuery.num
				}).then(res => {
					let data = res.data
					if (data.code === 200) {
						this.taskQuery.page = data.data.page
						this.taskQuery.next = data.data.next
						if (this.taskQuery.next) {
							this.taskQuery.status = 'loadmore'
						} else {
							this.taskQuery.status = 'nomore'
						}
						this.taskArr.push(...data.data.date)
					}
				}).catch(err => {
					this.$refs.uToast.show({
						title: '服务器开小差了o(╥﹏╥)o',
						type: 'error'
					})
				})
			},
			// 判断指定id的对象在对象数组中的位置
			fundById(arr, id) {
				for (let i = 0; i < arr.length; i++) {
					if (arr[i].planId === id) {
						return i
					}
				}
				return -1
			},
			getPlanById(planId, arr = this.taskArr) {
				this.$apis.getPlanById({
					userId: this.userId,
					planId
				}).then(({data}) => {
					if (data.code === 200) {
						let date = data.data
						let i = this.fundById(arr, planId)
						if (i !== -1) {
							this.$set(arr, i, date)
						} else {
							arr.unshift(date)
						}
					}
				}).catch(err => {
					this.$refs.uToast.show({
						title: '服务器开小差了o(╥﹏╥)o',
						type: 'error'
					})
				})
			},
			detachPlan(planId) {
				this.getPlanById(planId)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		height: 100vh;
		
		.item {
			padding: 20rpx 20rpx 0 20rpx;
		}
		.null-box {
			height: 38%;
		}
		.target {
			width: 100%;
			padding: 25rpx 20rpx;
			display: flex;
			flex-wrap: wrap;
			.target-box {
				width: 48%;
				margin-bottom: 20rpx;
				background-color: #ffffff;
				border-radius: 12rpx;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
				padding: 30rpx;
				position: relative;
				overflow: hidden;
				.head {
					display: flex;
					height: 74rpx;
					.title {
						flex: 5;
						word-wrap: break-word;
						word-break: break-all;
					}
					.time {
						font-size: 32rpx;
						font-weight: bold;
						text-align: left;
					}
					.tag {
						flex: 2;
					}
				}
				.title {
					font-size: 28rpx;
					color: $u-main-color;
					letter-spacing: 2rpx;
					position: relative;
					.title-icon {
						position: absolute;
						right: 0;
					}
				}
				.tip {
					font-size: 26rpx;
					color: $u-tips-color;
					margin-top: 10rpx;
				}
				.nums {
					letter-spacing: 2rpx;
					.nums-blod {
						font-size: 50rpx;
						font-weight: bold;
						color: $u-main-color;
					}
					.nums-tip {
						margin-left: 10rpx;
						font-size: 26rpx;
						color: $u-tips-color;
					}
				}
				.bold {
					color: #303133;
					font-weight: bold;
				}
				.bg {
					width: 140rpx;
					height: 140rpx;
					position: absolute;
					right: -30rpx;
					bottom: -20rpx;
					opacity: .2;
				}
				.finsh-bg {
					width: 100rpx;
					height: 100rpx;
					position: absolute;
					transform: rotate(75deg);
					top: 0;
					right: 0;
					opacity: .4;
				}
				.content {
					text-align: center;
					.title {
						margin-bottom: 5rpx;
					}
					.num {
						.blod {
							font-size: 50rpx;
							font-weight: bold;
							color: $u-main-color;
						}
						.tip {
							margin-left: 6rpx;
							font-size: 26rpx;
							color: $u-tips-color;
						}
					}
					.link {
						margin-top: 5rpx;
						font-size: 26rpx;
						color: $u-tips-color;
					}
				}
			}
			.progress {
				margin-top: 15rpx;
			}
			.target-box:nth-child(even) {
				margin-left: 4%;
			}
			.target-plus {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				.plus-tip {
					margin-top: 10rpx;
					font-size: 26rpx;
					color: $u-tips-color;
				}
			}
		}
	}
	.target-mask {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		right: 0;
		border-radius: 12rpx;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 10070;
		transition: all 0.3s ease-in-out 0s;
		transform: scale(1, 1);
		.mask-content {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: space-around;
		}
	}
	.popup-content {
		width: 100%;
		height: 100%;
		padding: 30rpx 0;
		.title {
			font-size: 32rpx;
			font-weight: bold;
			color: #303133;
			padding: 0 30rpx;
			text-align: center;
		}
		.text {
			margin-top: 40rpx;
			.tip {
				font-size: 28rpx;
				color: #303133;
			}
			.time {
				font-size: 34rpx;
				font-weight: bold;
			}
			.num {
				font-size: 50rpx;
				font-weight: bold;
			}
			.unit {
				font-size: 28rpx;
				color: #303133;
				margin-left: 6rpx;
			}
		}
		.box {
			text-align: center;
			margin-top: 20rpx;
		}
		.popup-icon {
			margin-left: 10rpx;
			vertical-align: middle;
		}
	}
	.time-text {
		align-items: center;
		margin-bottom: 10rpx;
		.tip {
			color: $u-tips-color;
			font-size: 28rpx;
		}
		.time {
			font-size: 30rpx;
			font-weight: bold;
		}
	}
	.box-text {
		display: flex;
		align-items: center;
		margin-top: 20rpx;
		.item {
			flex: 1;
			display: flex;
			flex-direction: column;
			text-align: center;
			padding: 0 30rpx 30rpx 30rpx;
			.text {
				color: $u-tips-color;
				font-size: 28rpx;
				margin-top: 8rpx;
			}
		}
	}
	.btns {
		margin-top: 40rpx;
		display: flex;
		justify-content: space-around;
		.btn-item {
			width: 90rpx;
			height: 90rpx;
			text-align: center;
			background-color: #FFFFFF;
			border-radius: 50%;
			box-shadow: 0 2px 12px 0 rgba(0,0, 0, 0.1);
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	
	
	
	.number-box {
		width: 100%;
		height: 100%;
		padding: 20rpx 30rpx;
		justify-content: center;
		align-items: center;
		text-align: center;
		.box-title {
			font-weight: bold;
			color: #303133;
			margin-bottom: 30rpx;
		}
		.box-handle {
			margin-bottom: 40rpx;
		}
		.tip {
			text-align: left;
			font-size: 26rpx;
			color: #909399;
			margin-bottom: 20rpx;
		}
	}
</style>
