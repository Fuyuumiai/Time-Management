<template>
	<view class="wrap">
		<!-- 导航栏 -->
		<u-navbar :is-back="false" :background="{ backgroundColor: '#fff' }" :border-bottom="false">
			<view class="slot-wrap">
				<view class="navbar-left">
					<view class="head">
						<text class="text">{{time.month}}月{{time.day}}日</text>
						<text class="week">{{time.week}}</text>
					</view>
				</view>
				<view class="navbar-right">
					<u-badge :is-dot="true" type="error" :offset="offset" v-if="notSign"></u-badge>
					<u-icon name="../../static/btnIcon/0.png" @click="routeTo('summary/index')"  size="40"/>
				</view>
			</view>
		</u-navbar>
		<u-gap height="10" bg-color="#fafafa"></u-gap>
		<!-- 一些其他附加的信息 -->
		<view class="more">
			<view class="card left">
				<view class="top" style="padding: 20rpx 25rpx;">
					<view class="tip">
						<text>历史上的今天</text>
					</view>
					<view class="content line-over" style="margin-top: 10rpx;">
						<text>{{history.date}}，{{history.title}}</text>
					</view>
					<view class="tip" style="margin-top: 10rpx; text-align: right;" @click="routeTo('home/todayHistory', {date})">
						<text>更多</text>
						<u-icon name="arrow-right" color="#909399" size="28" ></u-icon>
					</view>
				</view>
			</view>
			<view class="card right">
				<view class="top" style="padding: 20rpx; margin-bottom: 20rpx;" v-if="city=== ''" @click="getLocation(true)">
					<view class="tip line-center" style="height: 100%;">
						<u-icon name="map" color="#909399" size="32"></u-icon>
						<text>未获取地址</text>
					</view>
				</view>
				<view class="top" style="padding: 20rpx;" v-else @click="getLocation(true)">
					<view class="address">
						<text>{{city}}</text>
					</view>
					<view class="tip">
						<text>{{weatherInfo.weather}}，{{weatherInfo.temperature}}°C</text>
					</view>
				</view>
				<view class="bottom">
					<u-button :hairLine="false" :disabled="summary" type="primary" @click="goSubmit">每日总结</u-button>
				</view>
			</view>
		</view>
		<u-gap height="10" margin-top="10" margin-bottom="10" bg-color="#fafafa"></u-gap>
		<view class="target-top">
			<u-section title="每日一句"  :right="false" :show-line="false" font-size="30"></u-section>
		</view>
		<!-- 一些其他附加的信息 -->
		<view class="more" style="margin-top: 6rpx;">
			<view class="card" style="width: 100%;">
				<view class="top">
					<view class="content">
						<u-read-more :toggle="true" show-height="150" text-indent="0"  font-size="26" close-text="展开阅读全部">
							<rich-text :nodes="soup"></rich-text>
						</u-read-more>
					</view>
				</view>
			</view>
		</view>
		<u-gap height="10" margin-top="10" margin-bottom="10" bg-color="#fafafa"></u-gap>
		<view class="target-top">
			<u-section title="我的目标"  sub-title="查看全部" :show-line="false" font-size="30" :info="`(${targetSize})`" @click="routeTo('target/list', {status: 0})"></u-section>
		</view>
		<!-- 目标 -->
		<scroll-view scroll-x @scrolltolower="queryActiveTarget" v-if="targetArray.length >= 1">
			<view class="target">
				<view class="target-box" v-for="(item, i) in targetArray" :key="i">
					<template v-if="item.type === 0">
						<view class="head">
							<view class="time">
								<text>距离{{item.title}}</text>
							</view>
						</view>
						<view class="nums" style="text-align: center;">
							<text class="nums-tip">剩余</text>
							<text class="nums-blod">{{ getTimeVal(item.endTime.result)}}</text>
							<text class="nums-tip">天</text>
						</view>
						<view class="bg">
							<u-image shape="circle" mode="aspectFit" width="100%" height="100%" src="../../static/img/target/time.png"></u-image>
						</view>
					</template>
					<template v-else>
						<view class="head">
							<view class="title">
								<text>{{item.title}}</text>
							</view>
							<view class="tag">
								<u-tag class="title-icon" text="今日" type="warning" mode="light" size="mini" v-if="item.numType === 0" />
								<u-tag class="title-icon" text="长期" type="success" mode="light" size="mini" v-else />
							</view>
						</view>
						<view class="nums">
							<text class="nums-blod">{{ item.num }}</text>
							<text class="nums-tip">{{ item.unit }}</text>
						</view>
						<view class="bg num-bg">
							<u-image v-if="item.numType === 0" shape="circle" mode="aspectFit" width="100%" height="100%" src="../../static/img/target/today.png"></u-image>
							<u-image v-else shape="circle" mode="aspectFit" width="100%" height="100%" src="../../static/img/target/long.png"></u-image>
						</view>
					</template>
				</view>
			</view>
		</scroll-view>
		<view class="target-null-box" v-else>
			<u-empty text="无进行中目标" mode="favor" icon-size="250" src="../../static/img/null/target-null.png"></u-empty>
		</view>
		<u-gap height="10" margin-top="10" margin-bottom="10" bg-color="#fafafa"></u-gap>
		<!-- 今日任务 -->
		<view class="task content-box">
			<u-section title="今日任务"  sub-title="查看全部" :show-line="false" font-size="30" :info="`(${taskArray.length})`" @click="routeTo('task/list')"></u-section>
			<task-card :taskArray="taskArray"></task-card>
		</view>
		<u-modal v-model="modal" :content="modalText" :show-cancel-button="true" @confirm="gotoAppPage"  @cancel="modal = false"></u-modal>
		<u-toast ref="uToast"/>
	</view>
</template>

<script>
import taskCard from '@/components/task-card';
import { mapGetters } from 'vuex'
// #ifdef APP-PLUS
	import { gotoAppLocationSetting, getLocationJurisdiction } from '../../util/location/index.js'
// #endif
export default {
	data() {
		return {
			// 今日时间
			today: new Date(),
			offset: [-4, -4],
			modal: false,
			modalText: '',
			errType: -1,
			date: '',
			// 判断周几模
			weeks: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
			taskArray: [],
			targetArray: [],
			targetSize: 0,
			targetQuery: {
				page: 1,
				num: 5,
				next: true
			},
			soup: '',
			summary: false,
			city: '',
			location: '',
			weatherInfo: {},
			appSet: false,
			history: {},
			notSign: true
		}
	},
	components: {
		taskCard
	},
	computed:{
		...mapGetters(['userId']),
		// 获取当天时间的月、日、周几
		time(){
			if (this.today.getDate()) {
				return {
					month: this.today.getMonth() + 1,
					day: this.today.getDate(),
					week: this.weeks[this.today.getDay()]
				}
			}
		}
	},
	methods: {
		// 前往其他页面
		routeTo(path, params = {}, type = 'navigateTo') {
			// 使用uView的跳转（传参数方便）
			this.$u.route({
				type,
				url: `pages/${path}`,
				params
			})
		},
		dateFormat(t) {
			let date = new Date() || t
			let y = date.getFullYear()
			let m = date.getMonth() + 1
			let d = date.getDate()
			return `${y}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}`
		},
		goSubmit() {
			let taskArray = this.taskArray.map((item, i) => {
				let {title, planId, type, node, startTime, endTime, remarks, address} = item
				return { title, planId, type, node, startTime, endTime, remarks, address, checked: false}
			})
			this.routeTo('summary/submit', {taskArray: JSON.stringify(taskArray), date: this.date, edit: 0})
		},
		getPlan() {
			this.$apis.getToDayPlan({
				userId: this.userId,
				time: new Date().getTime()
			}).then(res => {
				let data = res.data;
				if (data.code === 200) {
					this.taskArray = data.data
					this.taskArray.sort((before, after) => {
						let a = before.startTime
						let b = after.startTime
						if (a.hour < b.hour) {
							return -1
						} else if (a.hour === b.hour) {
							if (a.minute < b.minute) {
								return -1
							} else if(a.minute === b.minute) {
								return 0
							}
						}
						return 1
					})
				}
			}).catch(err => {
				this.$refs.uToast.show({
					title: err,
					type: 'error'
				})
			})
		},
		fundById(arr, id) {
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].planId === id) {
					return i
				}
			}
			return -1
		},
		getPlanById(planId) {
			this.$apis.getPlanById({
				userId: this.userId,
				planId
			}).then(({data}) => {
				if (data.code === 200) {
					let date = data.data
					let i = this.fundById(this.taskArray, planId)
					this.$set(this.taskArray, i, date)
				}
			}).catch(err => {
				this.$refs.uToast.show({
					title: err,
					type: 'error'
				})
			})
		},
		getTimeVal(t) {
			let t1 = this.today.getTime()
			let t2 = new Date(t).getTime()
			let date = t2 - t1
			return parseInt(date / (1000 * 60 * 60 * 24))
		},
		queryActiveTarget(){
			if (!this.targetQuery.next) {
				return false
			}
			if (this.userId) {
				this.$apis.queryTypeTarget({
					userId: this.userId, 
					status: 0, 
					page: this.targetQuery.page,
					num: this.targetQuery.num
				}).then(({data}) => {
					if (data.code === 200) {
						this.targetQuery.page = data.data.page
						this.targetQuery.next = data.data.next
						this.targetSize = data.data.size
						this.targetArray.push(...data.data.list)
					} else {
						this.$refs.uToast.show({title: data.message})
					}
				}).catch(err => {
					this.$refs.uToast.show({title: '服务器开小差了'})
				})
			}
		},
		judgeExist() {
			if (this.userId) {
				this.$apis.judgeExist({
					userId: this.userId,
					date: this.date
				}).then(({data}) => {
					if (data.code === 200) {
						this.summary = true
					}
				}).catch(err => {
					this.$refs.uToast.show({title: '服务器开小差了'})
				})
			}
		},
		haveNotSign() {
			if (this.userId) {
				this.$apis.haveNotSign({
					userId: this.userId
				}).then(({data}) => {
					if (data.code === 200) {
						this.notSign = data.data
					}
				}).catch(err => {
					this.$refs.uToast.show({title: '服务器开小差了'})
				})
			}
		},
		getTodaySoup(date) {
			this.$apis.getTodaySoup({
				date
			}).then(({data}) => {
				if (data.code === 200) {
					this.soup = data.data.soup
				} else {
					this.$refs.uToast.show({title: data.message})
				}
			}).catch(err => {
				this.$refs.uToast.show({title: '服务器开小差了'})
			})
		},
		getLocation(show) {
			uni.getLocation({
				type: 'wgs84',
				success: ({longitude, latitude}) => {
					console.log(1)
					this.location = `${longitude},${latitude}` 
					this.getWeather()
				},
				fail: (e) => {
					if (show) {
						if (e.errCode === 22) {
							this.modalText = '应用无定位权限，是否前往设置？'
							this.errType = 1
						} else {
							this.modalText = '未开启定位，是否前往开启？'
							this.errType = 0
						}
						this.appSet = true
						this.modal = true
					}
				}
			})
		},
		gotoAppPage() {
			// #ifdef APP-PLUS
				if (this.errType === 0) {
					gotoAppLocationSetting()
				} else {
					getLocationJurisdiction()
				}
			// #endif
		},
		getWeather() {
			this.$apis.getTodayCityWeather({
				date: this.date,
				city: this.city,
				location: this.location
			}).then(({data}) => {
				if (data.code === 200) {
					this.weatherInfo = data.data.info
					this.city = data.data.info.city
				} else {
					this.$refs.uToast.show({title: data.message})
				}
			}).catch(err => {
				console.log(err)
				this.$refs.uToast.show({title: '服务器开小差了'})
			})
		},
		getTodayHistory() {
			this.$apis.getTodayHistory({
				date: this.date
			}).then(({data}) => {
				if (data.code === 200) {
					this.history = data.data
				} else {
					this.$refs.uToast.show({title: data.message})
				}
			}).catch(err => {
				this.$refs.uToast.show({title: '服务器开小差了'})
			})
		}
	},
	onShow() {
		this.getPlan()
		this.targetQuery = {
			page: 1,
			num: 5,
			next: true
		}
		this.targetArray = []
		this.queryActiveTarget()
		if (!this.summary) {
			this.judgeExist()
		}
		if (this.notSign) {
			this.haveNotSign()
		}
		if (this.appSet) {
			this.appSet = false
			this.getLocation(true)
		}
	},
	onLoad() {
		this.date = this.dateFormat(this.today)
		this.getTodaySoup(this.date)
		this.getTodayHistory()
		this.getLocation(false)
	}
};
</script>

<style scoped lang="scss">
.wrap {
	position: relative;
	height: 100vh;
	background-color: #fff;
}
.null-box {
	position: absolute;
	height: 50%;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -55%);
	.btn {
		text-align: center;
		.btn-item {
			width: 90%;
			margin-top: 25rpx;
		}
	}
}
.slot-wrap{
	flex: 1;
	display: flex;
	padding: 0rpx 20rpx;
	justify-content: space-around;
	align-items: center;
	.navbar-left {
		flex: 8;
		letter-spacing: 2rpx;
		display: flex;
		flex-direction: column;
		.text {
			font-size: 34rpx;
			font-weight: bold;
			color: #303133;
		}
		.week {
			font-size: 26rpx;
			color: #909399;
			margin-left: 10rpx;
		}
	}
	.navbar-right {
		flex: 1;
		position: relative;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
}

.content-box {
	padding: 0 20rpx;
	margin-top: 20rpx;
	position: relative;
}
.card-box {
	background-color: #FFFFFF;
	border-radius: 10rpx;
	box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, 0.1);
	
}

.target-top {
	padding: 10rpx 20rpx 0;
}

.target {
	padding: 30rpx 20rpx 0;
	width: 100%;
	white-space: nowrap;
	.target-box {
		display: inline-block;
		width: 48%;
		margin-bottom: 20rpx;
		background-color: #ffffff;
		border-radius: 12rpx;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		padding: 30rpx;
		margin-right: 30rpx;
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
		.target-box:last-of-type {
			margin-right: 0rpx;
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
	}
}

.more {
	padding: 20rpx 20rpx;
	display: flex;
	.left {
		flex: 3;
	}
	.line-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.right {
		flex: 2;
		margin-left: 20rpx;
	}
	.tip {
		font-size: 26rpx;
		color: #909399;
	}
	.content {
		color: #606266;
		line-height: 1.6;
	}
	.line-over {
		display: -webkit-box;
		word-break: break-all;
		    text-overflow:ellipsis;
		    overflow: hidden;
		    white-space: pre-line;
		    -webkit-box-orient: vertical;
		    -webkit-line-clamp:2;
	}
	.card {
		display: flex;
		flex-direction: column;
		.top {
			flex: 1;
			padding: 30rpx 25rpx;
			background-color: #ffffff;
			border-radius: 12rpx;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		}
		.bottom {
			margin-top: 30rpx;
			flex: 1;
		}
	}
}
.target-null-box {
	width: 100%;
	height: 300rpx;

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
::v-deep .u-content {
	font-size: 30rpx;
	color: #303133;
}
</style>
