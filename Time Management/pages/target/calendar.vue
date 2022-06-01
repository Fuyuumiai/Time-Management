<template>
	<view class="wrap">
		<u-navbar :background="{ backgroundColor: '#ffffff' }" title="历史记录" title-size="30" :border-bottom="false"></u-navbar>
		<u-gap height="12" bg-color="#fafafa"></u-gap>
		 <uni-calendar 
		    :insert="true" 
		    :start-date="'2022-3-1'"
		    :end-date="today"
			@change="change"
		 />
		<u-gap height="12" bg-color="#fafafa"></u-gap>
		<view class="record" v-if="record.length > 0">
			<view class="record-item" v-for="(item, i) in record" :key="i">
				<view class="text">
					<u-tag v-if="item.numType === 0" text="每日执行" mode="dark" type="warning" size="mini" />
					<u-tag v-else text="长期计划" mode="dark" type="success" size="mini" />
					<text class="title">{{item.title}}哈</text>
				</view>
				<view class="num">
					<view class="time">
						<text>{{item.record.date.split(' ')[1]}}</text>
					</view>
					<view class="add" v-if="item.record.addNum > 0">
						<text class="tip">+</text>
						<text class="val">{{item.record.addNum}}</text>
						<text class="tip">个</text>
					</view>
					<view class="add" v-else>
						<text>手动完成</text>
					</view>
				</view>
			</view>
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
	export default {
		data() {
			return {
				date: '',
				today: '',
				popupShow: false,
				loadingSrc: '/static/img/tips/uploadLoading.gif',
				records: [],
				record: []
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
				let flag = this.records.some((item, i) => {
					if (item.date === this.date) {
						this.record = this.records[i].list
						return true
					}
				})
				if (!flag) {
					this.queryDateInfo(this.date)
				}
			},
			queryDateInfo(date) {
				this.popupShow = true
				this.$apis.queryDateInfo({
					userId: this.userId,
					date
				}).then(({data}) => {
					if (data.code === 200) {
						this.records.push(data.data)
						this.record = data.data.list
					} else {
						this.$refs.uToast.show({title: data.message})
					}
				}).catch(() => {
					this.$refs.uToast.show({title: '服务器开小差了'})
				}).finally(() => {
					setTimeout(() => {
						this.popupShow = false
					}, 300)
				})
			}
		},
		onLoad() {
			this.today = this.date = this.initDate()
			this.queryDateInfo(this.date)
		}
	}
</script>

<style lang="scss" scoped>
	.wrap{
		.record {
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
	::v-deep .uni-calendar__header {
		border-bottom-color: #f8f8f8;
	}
</style>

