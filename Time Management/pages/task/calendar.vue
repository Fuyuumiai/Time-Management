<template>
	<view class="wrap">
		<u-navbar :background="{ backgroundColor: '#ffffff' }" title="历史记录" title-size="30" :border-bottom="false"></u-navbar>
		<u-gap height="12" bg-color="#fafafa"></u-gap>
		 <uni-calendar 
		    :insert="true" 
		    :start-date="startDate"
		    :end-date="today"
			@change="change"
		 />
		<u-gap height="12" bg-color="#fafafa"></u-gap>
		<view class="content" v-if="task.length">
			<task-card :taskArray="task"></task-card>
		</view>
		<u-empty  v-else text="当日无执行记录" mode="favor" margin-top="50" icon-size="300" src="../../static/img/null/list-null.png"></u-empty>
		<!-- 加载等待组件 -->
		<u-popup v-model="popupShow" width="200" height="200"  mode="center" :mask-close-able="false" border-radius="12">
			<u-image width="100%" height="200rpx" :src="loadingSrc"></u-image>
		</u-popup>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import taskCard from '@/components/task-card';
	export default {
		data() {
			return {
				date: '',
				today: '',
				popupShow: false,
				loadingSrc: '/static/img/tips/uploadLoading.gif',
				tasks: [],
				task: [],
				startDate: ''
			}
		},
		computed: {
			...mapGetters(['userId'])
		},
		components: {
			taskCard
		},
		methods: {
			initDate(t) {
				let date = new Date || t
				let y = date.getFullYear()
				let m = date.getMonth() + 1
				let d = date.getDate()
				return `${y}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}`
			},
			change(e) {
				this.date = e.fulldate
				if (this.date === this.today) {
					this.task = this.tasks
				} else {
					this.queryDateInfo(this.date)
				}
			},
			queryDateInfo(date) {
				this.popupShow = true
				this.$apis.querySummaryTask({
					userId: this.userId,
					date
				}).then(({data}) => {
					if (data.code === 200) {
						// this.tasks.push({date: data.data.taskArr})
						this.task = data.data.taskArr
					} else {
						this.$refs.uToast.show({title: data.message})
					}
				}).catch(() => {
					this.$refs.uToast.show({title: '服务器开小差了'})
				}).finally(() => {
					this.popupShow = false
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
			},
			getPlan() {
				this.$apis.getToDayPlan({
					userId: this.userId,
					time: new Date().getTime()
				}).then(res => {
					let data = res.data;
					if (data.code === 200) {
						this.tasks = data.data
						this.task = data.data
					}
				}).catch(err => {
					this.$refs.uToast.show({
						title: err,
						type: 'error'
					})
				})
			}
		},
		onLoad() {
			this.today = this.date = this.initDate()
			this.getStartDate()
			this.getPlan()
		}
	}
</script>

<style lang="scss" scoped>
	.wrap{
		.task {
			padding: 30rpx 20rpx;
			&-item {
				width: 100%;
				padding: 30rpx 25rpx;
				border-radius: 10rpx;
				margin-bottom: 20rpx;
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
	}
	.content {
		padding: 0rpx 25rpx 10rpx;
	}
	::v-deep .uni-calendar__header {
		border-bottom-color: #f8f8f8;
	}
</style>

