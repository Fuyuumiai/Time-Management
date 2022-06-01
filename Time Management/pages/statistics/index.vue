<template>
	<view class="wrap">
		<u-navbar :background="{ backgroundColor: '#fff' }" title-color="#303133" title-size="30" :border-bottom="false" :is-back="false" title="数据统计"></u-navbar>
		<u-gap height="12" bg-color="#fafafa"></u-gap>
		<view class="sub">
			<view class="sub-select"><u-subsection :list="subList" :current="subCur" bg-color="#f2f2f2" active-color="#409EFF" @change="subChange"></u-subsection></view>
		</view>

		<view class="num">
			<u-gap height="12" bg-color="#fafafa"></u-gap>
			<view class="tip">
				<u-icon name="info-circle" color="#909399" size="32" style="vertical-align: text-bottom; margin-right: 8rpx;"></u-icon>
				<text>未提交当日总结，将不会被录入数据</text>
			</view>
			<u-grid :col="3">
				<u-grid-item class="num-item">
					<view class="num-item-text"><text>{{record.node}}</text></view>
					<view class="num-item-tip"><text>节点任务量</text></view>
				</u-grid-item>
				<u-grid-item class="num-item">
					<view class="num-item-text"><text>{{record.task}}</text></view>
					<view class="num-item-tip"><text>常规任务量</text></view>
				</u-grid-item>
				<u-grid-item class="num-item">
					<view class="num-item-text"><text>{{record.target}}</text></view>
					<view class="num-item-tip"><text>数量目标量</text></view>
				</u-grid-item>
				<u-grid-item class="num-item">
					<view class="num-item-text"><text>{{record.total}}</text></view>
					<view class="num-item-tip"><text>总计（分钟）</text></view>
				</u-grid-item>
				<u-grid-item class="num-item">
					<view class="num-item-text"><text>{{record.average}}</text></view>
					<view class="num-item-tip"><text>自评平均分</text></view>
				</u-grid-item>
			</u-grid>
		</view>
		<view class="content">
			<u-gap height="12" bg-color="#fafafa"></u-gap>
			<view class="item">
				<view class="charts-title">
					<view class="title-color"></view>
					<view class="title-text">任务类型占比</view>
				</view>
				<view class="charts-box" v-if="judgeObj(taskInfo)">
					<qiun-data-charts style="height: 480rpx;" type="pie" :chartData="pie"/>
				</view>
				<u-empty text="数据为空" v-else mode="favor" margin-top="20" icon-size="300" src="../../static/img/null/record-null.png"></u-empty>
			</view>
			<u-gap height="12" bg-color="#fafafa"></u-gap>
			<view class="item">
				<view class="charts-title">
					<view class="title-color"></view>
					<view class="title-text">任务用时占比</view>
				</view>
				<view class="charts-box" v-if="judgeObj(taskInfo)">
					 <qiun-data-charts style="height: 480rpx;" type="ring" :opts="ringOpt" :chartData="ring"/>
				</view>
				<u-empty text="数据为空" v-else mode="favor" margin-top="20" icon-size="300" src="../../static/img/null/record-null.png"></u-empty>
			</view>
			<u-gap height="12" bg-color="#fafafa"></u-gap>
			<view class="item">
				<view class="charts-title">
					<view class="title-color"></view>
					<view class="title-text">任务完成比</view>
				</view>
				<view class="charts-box" v-if="judgeArr(record.taskFinish)">
					<qiun-data-charts type="column" style="height: 480rpx;" :chartData="column"/>
				</view>
				<u-empty text="数据为空" v-else mode="favor" margin-top="20" icon-size="300" src="../../static/img/null/record-null.png"></u-empty>
			</view>
			<u-gap height="12" bg-color="#fafafa"></u-gap>
			<view class="item">
				<view class="charts-title">
					<view class="title-color"></view>
					<view class="title-text">自我评分曲线</view>
				</view>
				<view class="charts-box" v-if="judgeArr(record.fraction)">
					<qiun-data-charts  type="area" :chartData="area" style="height: 480rpx;" />
				</view>
				<u-empty text="数据为空" v-else mode="favor" margin-top="20" icon-size="300" src="../../static/img/null/record-null.png"></u-empty>
			</view>
		</view>
		<u-toast ref="uToast"/>
	</view>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	data() {
		return {
			subList: [{ name: '今日' }, { name: '近七天' }, { name: '近一月' }],
			subCur: 0,
			record: {
				taskFinish: [],
				fraction: []
			},
			pie: {},
			column: {},
			ring: {},
			ringOpt: {
				title: {
					name: "总计（分钟）",
					fontSize: 14,
					color: "#909399"
				},
				subtitle: {
					name: "701",
					fontSize: 20,
					color: "#303133"
				}
			},
			area: {},
			taskInfo: {},
			targetInfo: {}
		};
	},
	computed: {
		...mapGetters(['userId'])
	},
	watch: {
		selectShow(newVal) {
			if (!newVal) {
				this.closeHandle(10);
				this.params[this.dateArr[this.dateCur]] = false;
			}
		}
	},
	methods: {
		subChange(i){
			switch(i) {
				case 0: return this.getData(0)
				case 1: return this.getData(7)
				case 2: return this.getData(30)
			}
		},
		getData(range) {
			this.$apis.queryRangeSummary({
				userId: this.userId,
				range
			}).then(({data}) => {
				if (data.code === 200) {
					this.record = data.data.record
					this.ringOpt.subtitle.name = this.record.total
					this.taskInfo = data.data.taskInfo
					this.targetInfo = data.data.targetInfo
					this.$nextTick(() => {
						this.initTaskData(data.data.taskInfo)
						this.initColumnData(this.record.taskFinish, data.data.dates)
						this.initAreaData(this.record.fraction, data.data.dates)
					})
				} else {
					this.$refs.uToast.show({title: data.message})
				}
			}).catch(err => {
				this.$refs.uToast.show({
					title: err,
					type: 'error'
				})
			})
		},
		getText(type) {
			switch(type) {
				case -1: return '节 点'
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
		initTaskData(data) {
			let pieList = []
			let ringList = []
			Object.keys(data).forEach(key => {
				let name = this.getText(Number(key))
				pieList.push({
					name,
					value: data[key].num
				})
				ringList.push({
					name,
					value: data[key].total
				})
			})
			this.pie = {series: [{data: pieList}]}
			this.ring = {series: [{data: ringList}]}
		},
		initColumnData(data, date) {
			let list = [{
				name: '目标量',
				data: []
				}, {
				name: '执行量',
				data: []
			}]
			data.forEach(item => {
				list[0].data.push(item.sum)
				list[1].data.push(item.complete)
			})
			this.column = {
				categories: date.slice(0, 7),
				series: list
			}
		},
		initAreaData(data, date) {
			this.area = {
				categories: date.slice(0, 7),
				series: [{
					name: '自评分',
					data: data
				}]
			}
		},
		judgeObj(obj) {
			if (JSON.stringify(obj) === '{}'){
				return false
			}
			return true
		},
		judgeArr(arr) {
			if (arr.length === 0) {
				return false
			}
			return true
		}
	},
	onShow() {
		this.subChange(this.subCur)
	}
};
</script>

<style scoped lang="scss">
.wrap {
	.content {
		padding: 0 4rpx;
	}
}
.sub {
	&-select {
		width: 70%;
		padding: 20rpx 0;
		margin: auto;
	}
	&-time {
		padding: 20rpx 0;
		color: #909399;
		font-size: 28rpx;
		text-align: center;
		display: flex;
		align-items: center;
		&-btn {
			margin: 0 20rpx;
		}
	}
}
.num {
	.tip {
		padding: 20rpx 25rpx;
		color: #909399;
		font-size: 26rpx;
	}
	&-item {
		text-align: center;
		&-text {
			color: #303133;
			font-size: 30rpx;
			font-weight: bold;
			margin-bottom: 10rpx;
		}
		&-tip {
			color: #909399;
			font-size: 26rpx;
		}
	}
}
.item {
	margin-top: 15rpx;
	padding-bottom: 12rpx;
	.charts-title {
		padding: 20rpx 12rpx;
		display: flex;
		align-items: center;
		.title-color {
			width: 8rpx;
			height: 34rpx;
			background-color: #409EFF;
		}
		.title-text {
			font-size: 28rpx;
			color: #303133;
			font-weight: bold;
			margin-left: 10rpx;
			line-height: 38rpx;
			height: 38rpx;
		}
	}
	.charts-box {
		width: 100%;
		height: auto;
		padding: 0 6rpx;
	}
}

::v-deep .u-btn--bold-border {
	border: 1rpx solid #f1f1f1;
}
::v-deep .qiun-title-dot {
	border-radius: 0rpx;
	height: 32rpx;
	margin-left: 8rpx;
}
::v-deep .qiun-title-text {
	font-size: 28rpx;
	line-height: 38rpx;
	height: 38rpx;
}
</style>
