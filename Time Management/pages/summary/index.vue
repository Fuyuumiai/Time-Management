<template>
	<view class="wrap">
		<u-navbar :background="{ backgroundColor: '#ffffff' }" title-color="#303133" title-size="30" :border-bottom="false" title="历史总结"></u-navbar>
		<u-gap height="12" bg-color="#fafafa"></u-gap>
		<uni-calendar 
		    :insert="true" 
		    :start-date="startDate"
		    :end-date="today"
			@change="change"
		 />
		<u-gap height="12" bg-color="#fafafa"></u-gap>
		<view class="content" v-if="sign">
		 	<u-section title="总结信息"  sub-title="前往修改" @click="routeTo('summary/submit', {edit: 1, date, summary: JSON.stringify(summary)})" :show-line="false" font-size="30"></u-section>
			<view class="card" style="margin-top: 30rpx;">
				<view class="line">
					<view class="line-item">
						<text class="item-tip">自我评分：</text>
						<text class="item-text">{{summary.fraction}}</text>
					</view>
				</view>
				<view class="line">
					<view class="line-item">
						<text class="item-tip">文字总结：</text>
						<text class="item-text">{{summary.content}}</text>
					</view>
				</view>
			</view>
			<view class="card">
				<u-collapse ref="taskColl">
					<u-collapse-item title="完成任务" :open="true">
						<view class="list">
							<view v-for="(item, i) in summary.taskArray" :key="i">
								<view class="list-item list-active-item" v-if="item.checked">
									<text>{{item.title}}</text>
								</view>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
			</view>
			<view class="card">
				<u-collapse ref="targetColl">
					<u-collapse-item title="目标完成量" :open="true">
						<view class="list">
							<view class="list-tip">
								<text>该列表包含长期计划当日完成量</text>
							</view>
							<view class="record">
								<view class="record-item" v-for="(item, i) in summary.targetArray" :key="i">
									<view class="text">
										<u-tag v-if="item.numType === 0" text="每日执行" mode="dark" type="warning" size="mini" />
										<u-tag v-else text="长期计划" mode="dark" type="success" size="mini" />
										<text class="title">{{item.title}}</text>
									</view>
									<view class="num">
										<view class="add">
											<text class="tip">+</text>
											<text class="val">{{item.addNum}}</text>
											<text class="tip">{{item.unit}}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
			</view>
		</view>
		<view class="null-box" v-else>
		 	<u-empty  text="当日未进行总结~" mode="favor" icon-size="300" src="../../static/img/null/summary-null.png"></u-empty>
			<u-button v-if="date === today" size="medium" :hairLine="false" type="success" shape="circle" @click="toSubmit">签 到</u-button>
			<u-button v-else size="medium" :hairLine="false" type="success" shape="circle" @click="routeTo('summary/submit', {edit: 1, date, summary: JSON.stringify(summary)})">签 到</u-button>
		 </view>
		 <u-toast ref="uToast"/>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				startDate: '',
				today: '',
				date: '',
				// 需显示的总结
				summary: {
					targetArray: [],
					taskArray: []
				},
				sign: false
			}
		},
		computed: {
			...mapGetters(['userId'])
		},
		methods: {
			initDate(t) {
				let date = new Date() || t
				let y = date.getFullYear()
				let m = date.getMonth() + 1
				let d = date.getDate()
				return `${y}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}`
			},
			change(e) {
				this.date = e.fulldate
				this.querySummary(this.date)
			},
			routeTo(path, params = {}, type = 'navigateTo') {
				// 使用uView的跳转（传参数方便）
				this.$u.route({
					type,
					url: `pages/${path}`,
					params
				})
			},
			toSubmit() {
				this.$apis.getToDayPlan({
					userId: this.userId,
					time: new Date().getTime()
				}).then(res => {
					let data = res.data
					if (data.code === 200) {
						let taskArray = data.data.map((item, i) => {
							let {title, planId, type, node, startTime, endTime, remarks, address} = item
							return { title, planId, type, node, startTime, endTime, remarks, address, checked: false}
						})
						this.routeTo('summary/submit', {taskArray: JSON.stringify(taskArray), date: this.date, edit: 0})
					}
				}).catch(err => {
					this.$refs.uToast.show({
						title: err,
						type: 'error'
					})
				})
			},
			querySummary(date) {
				this.$apis.querySummary({
					userId: this.userId,
					date
				}).then(({data}) => {
					if (data.code === 200) {
						this.sign = data.data.sign
						if (data.data.sign) {
							this.summary = data.data
							this.$nextTick(() => {
								this.$refs.taskColl.init()
								this.$refs.targetColl.init()
							})
						}
					} else {
						this.$refs.uToast.show({title: data.message})
					}
				}).catch(err => {
					console.log(err)
					this.$refs.uToast.show({title: '服务器开小差了'})
				})
			},
			getStartDate() {
				this.$apis.getStartDate({
					userId: this.userId
				}).then(({data}) => {
					if (data.code === 200) {
						this.startDate = data.data.startDate
					} else {
						this.$refs.uToast.show({title: data.message})
					}
				}).catch(err => {
					this.$refs.uToast.show({title: '服务器开小差了'})
				})
			}
		},
		onLoad(option) {
			this.today = this.date = this.initDate()
			this.getStartDate()
		},
		onShow() {
			this.querySummary(this.date)
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		background-color: #ffffff;
		position: relative;
		.content {
			padding: 30rpx 20rpx;
		}
		.null-box {
			width: 100%;
			padding: 20rpx 30rpx;
			text-align: center;
		}
	}
	.card {
		width: 100%;
		padding: 30rpx 25rpx;
		margin-bottom: 25rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, 0.1);
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
					line-height: 1.6;
				}
				.item-icon {
					vertical-align: middle;
					margin-right: 6rpx;
				}
				.item-label {
					color: #606266;
				}
			}
		}
		.line:last-of-type {
			margin-bottom: 0rpx;
		}
	}
	.list {
		padding: 0 10rpx;
		margin-bottom: 15rpx;
		&-tag {
			margin-bottom: 6rpx;
		}
		&-line {
			width: 100%;
			padding: 10rpx 0;
			display: flex;
			&-left {
				flex: 3;
			}
			&-right {
				flex: 3;
				display: flex;
				justify-content: flex-end;
			}
			&-num {
				flex: 1;
				text-align: right;
			}
		}
		&-tip {
			font-size: 26rpx;
			color: #909399;
		}
		&-item {
			width: 100%;
			margin-top: 20rpx;
			background-color: #FFFFFF;
			padding: 30rpx 26rpx;
			border-radius: 10rpx;
			box-shadow: 0 4rpx 12rpx 0 rgba(0, 0, 0, 0.1);
			color: #303133;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			&-text {
				flex: 3;
			}
			&-box {
				flex: 1;
			}
		}
		&-active-item {
			background-color: #409EFF;
			color: #fff;
		}
	}
	.record {
		padding-top: 20rpx;
		&-item {
			width: 100%;
			padding: 30rpx 25rpx;
			border-radius: 10rpx;
			margin-bottom: 30rpx;
			box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, 0.1);
			background-color: #ffffff;
			display: flex;
			.text {
				flex: 3;
				.title {
					display: block;
					font-size: 30rpx;
					color: #303133;
					font-weight: bold;
					margin-top: 12rpx;
				}
			}
			.num {
				flex: 1;
				text-align: center;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.time {
					margin-bottom: 12rpx;
					letter-spacing: 2rpx;
					font-size: 26rpx;
					color: #606266;
				}
				.val {
					font-size: 32rpx;
					color: #303133;
					font-weight: bold;
				}
				.tip {
					font-size: 26rpx;
					color: #909399;
					margin: 0 4rpx;
				}
				.add {
					font-weight: bold;
					color: #303133;
				}
			}
		}
	}
	::v-deep .u-collapse-head {
		font-weight: bold;
	}
	::v-deep .uni-calendar__header {
		border-bottom-color: #f8f8f8;
	}	
</style>
