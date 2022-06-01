<template>
	<view class="wrap">
		<u-navbar :background="{ backgroundColor: '#ffffff' }" title-color="#303133" title-size="30" :border-bottom="false" title="任务详情"></u-navbar>
		<view class="content" v-if="task">
			<view class="info item">
				<view class="title">
					<text>基础信息</text>
				</view>
				<view class="line">
					<view class="line-item">
						<text class="item-tip">任务标题：</text>
						<text class="item-text">{{task.title}}</text>
					</view>
				</view>
				<view class="line">
					<view class="line-item ">
						<text class="item-tip">任务类型：</text>
						<text class="item-text">{{getTagText(task.type)}}</text>
					</view>
					<view class="line-item" v-if="task.repeat">
						<text class="item-tip">任务状态：</text>
						<text class="item-text" v-if="task.active"><u-tag text="执行中" type="success" mode="dark" size="mini" /></text>
						<text class="item-text" v-else><u-tag text="待执行" mode="dark" size="mini" /></text>
					</view>
					<view class="line-item" v-else>
						<text class="item-tip">任务状态：</text>
						<text class="item-text"><u-tag text="已过期" type="info" mode="dark" size="mini" /></text>
					</view>
				</view>
				<view class="line">
					<view class="line-item" v-if="task.node">
						<text class="item-tip">执行时间：</text>
						<text class="item-text">{{padString(task.startTime.hour)}}:{{padString(task.startTime.minute)}}</text>
					</view>
					<view class="line-item" v-else>
						<text class="item-tip">执行时段：</text>
						<text class="item-text">{{padString(task.startTime.hour)}}:{{padString(task.startTime.minute)}} ~ {{padString(task.endTime.hour)}}:{{padString(task.endTime.minute)}}</text>
					</view>
				</view>
				<view class="line" v-if="task.remarks">
					<view class="line-item">
						<text class="item-tip">备 注：</text>
						<text class="item-text">{{task.remarks}}</text>
					</view>
				</view>
				<view class="line" v-if="task.address">
					<view class="line-item">
						<text class="item-tip">地 址：</text>
						<text class="item-text">{{task.address}}</text>
					</view>
				</view>
			</view>
			<view class="repeat item" v-if="task.status">
				<view class="title">
					<text>循环信息</text>
				</view>
				<view class="line">
					<view class="line-item">
						<text class="item-tip">循环频率：</text>
						<text class="item-text">{{task.repeatSet.rate ? '周' : '天'}}</text>
					</view>
					<view class="line-item">
						<text class="item-tip">循环周期：</text>
						<text class="item-text">{{task.repeatSet.unit}}{{task.repeatSet.rate ? '周' : '天'}}</text>
					</view>
				</view>
				<view class="line">
					<view class="line-item">
						<text class="item-tip">循环次数：</text>
						<text class="item-text" v-if="task.repeatSet.num">{{task.repeatSet.num}}次</text>
						<text class="item-text" v-else>无限次</text>
					</view>
				</view>
			</view>
			<view class="week item" v-if="task.repeatSet.week.length">
				<view class="title">
					<text>所在星期</text>
				</view>
				<u-row gutter="16" class="check-row">
					<u-col span="3" text-align="center"  class="check-col" :class="{'active-col': judgeIn(i)}"  v-for="i in 7" :key="i">
						<text>{{numToStr(i)}}</text>
					</u-col>
				</u-row>
			</view>
			<view class="item">
				<view class="title">
					<text>执行日期总览</text>
				</view>
				<view class="list">
					<u-row gutter="16" v-if="task.repeatSet.num === 0">
						<u-col span="4">
							<view class="time-item">
								<text>无限次</text>
							</view>
						</u-col>
					</u-row>
					<u-row gutter="16" v-else>
						<u-col span="4" v-for="date in task.executes" :key="date">
							<view class="time-item">
								<text>{{date}}</text>
							</view>
						</u-col>
					</u-row>
				</view>
			</view>
		</view>
		<u-popup v-else v-model="loadingShow" mode="center" :mask-close-able="false" width="400rpx" height="300rpx" border-radius="12">
			<view class="loading-box">
				<text>页面加载中，请稍后~</text>
				<u-image width="100%" height="200rpx" src="/static/img/tips/uploadLoading.gif"></u-image>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				loadingShow: true,
				task: null
			}
		},
		computed: {
			...mapGetters(['userId'])
		},
		methods: {
			getTagText(type) {
				switch(type) {
					case -1: return '节点任务'
					case 0: return '其 他'
					case 1: return '学 习'
					case 2: return '工 作'
					case 3: return '出 行'
					case 4: return '娱 乐'
					case 5: return '运 动'
					case 6: return '吃 饭'
					case 7: return '睡 觉'
				}
			},
			judgeIn(i) {
				return this.task.repeatSet.week.includes(i)
			},
			// 数字转换
			numToStr(i){
				switch (i){
					case 1: return '周一'
					case 2: return '周二'
					case 3: return '周三'
					case 4: return '周四'
					case 5: return '周五'
					case 6: return '周六'
					case 7: return '周日'
				}
			},
			padString(str) {
				str = str.toString()
				return str.padStart(2, '0')
			},
			// 时间格式转换
			dateFromat(date) {
				if (!date) return '当前任务尚未执行'
				let time = `${this.padString(this.task.startTime.hour)}:${this.padString(this.task.startTime.minute)}`
				if (!this.task.node) {
					time = `${time} ~ ${this.padString(this.task.endTime.hour)}:${this.padString(this.task.endTime.minute)}`
				}
				
				return `${date} ${time}`
			},
			getPlanById(planId) {
				this.$apis.getDetailPlanById({
					userId: this.userId,
					planId
				}).then(({data}) => {
					if (data.code === 200) {
						this.loadingShow = false
						this.task = data.data
						// this.show = true
					}
				}).catch(err => {
					this.$refs.uToast.show({
						title: err,
						type: 'error'
					})
				})
			}
		},
		onLoad(option) {
			let planId = Number(option.planId)
			if (planId) {
				this.getPlanById(planId)	
			}
		}
	}
</script>

<style scoped lang="scss">
	::v-deep .u-tag {
		vertical-align: top;
	}
	.wrap {
		height: 100vh;
		background-color: #fafafa;
		position: relative;
		.content {
			padding: 30rpx;
			.item {
				width: 100%;
				border-radius: 12rpx;
				padding: 35rpx 25rpx;
				box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, 0.1);
				background-color: #ffffff;
				margin-bottom: 25rpx;
				.title {
					font-size: 32rpx;
					font-weight: bold;
					margin-bottom: 25rpx;
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
						}
					}
					.right {
						text-align: right;
					}
				}
				.line:last-of-type {
					margin-bottom: 0rpx;
				}
				&-time{
					padding-left: 18rpx;
				}
			}
		}
		.check-row {
			margin-top: 30rpx;
			background-color: #FaFaFa;
			border-radius: 16rpx;
			overflow: hidden;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			.check-col {
				height: 120rpx;
				background-color: #FFF;
				border: 2rpx solid #fAfAfA;
				color: $u-main-color;
				line-height: 120rpx;
			}
			.active-col {
				background-color: #2979ff;
				color: #fff;
			}
		}
	}
	.time-item {
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		font-size: 26rpx;
		background-color: #f6f6f6;
		border-radius: 8rpx;
		margin-bottom: 12rpx;
	}
	::v-deep .uni-scroll-view {
		background-color: #fbfbfb;
	}
	.loading-box {
		text-align: center;
		padding: 30rpx 40rpx;
	}
</style>
