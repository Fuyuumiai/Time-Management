<template>
	<view class="list">
		<view class="card" v-for="(item, i) in taskArray" :key="i">
			<view class="head" v-if="item.repeat">
				<view class="color" :class="[item.active ? 'bgc-gren' : 'bgc-blue']"></view>
				<view class="title">
					<text>{{item.title}}</text>
				</view>
				<view class="type" :class="[item.active ? 'text-gren' : 'text-blue']">
					<text>{{ item.active ? '进行中' : '待执行' }}</text>
				</view>
			</view>
			<view class="head" v-else>
				<view class="color bgc-gray"></view>
				<view class="title">
					<text>{{item.title}}</text>
				</view>
				<view class="type text-gray">
					<text>已过期</text>
				</view>
			</view>
			<view class="content">
				<view class="line type-time">
					<view class="type">
						<text class="tip">类 型：</text>
						<view class="cu-tag sm radius" :class="getTagBg(item.type)">
							{{getTagText(item.type)}}
						</view>
						<view class="cu-tag sm radius bg-blue" v-if="item.repeatSet.status">
							循 环
						</view>
					</view>
					<view class="time" v-if="item.node">
						<text class="tip">执行时间：</text>
						<text>{{padString(item.startTime.hour)}}:{{padString(item.startTime.minute)}}</text>
					</view>
					<view class="time" v-else>
						<text class="tip">执行时段：</text>
						<text >{{padString(item.startTime.hour)}}:{{padString(item.startTime.minute)}} ~ {{padString(item.endTime.hour)}}:{{padString(item.endTime.minute)}}</text>
					</view>
				</view>
				<view class="line remarks" v-if="item.remarks">
					<text class="tip">备 注：</text>
					<text>{{item.remarks}}</text>
				</view>
				<view class="line address" v-if="item.address">
					<text class="tip">地 址：</text>
					<text>{{item.address}}</text>
				</view>
			</view>
			<view class="btns">
				<view class="item" v-if="item.repeat">
					<u-image shape="circle" mode="aspectFit" width="100%" height="90rpx" src="./static/img/edit.png" @click="routeTo('task/handleTask', {task: JSON.stringify(item),edit: 1})"></u-image>
					<text class="tip">编 辑</text>
				</view>
				<view class="item">
					<u-image shape="circle" mode="aspectFit" width="100%" height="90rpx" src="./static/img/mould.png" @click="routeTo('task/handleTask', {task: JSON.stringify(item), edit: 0})"></u-image>
					<text class="tip">模 板</text>
				</view>
				<view class="item">
					<u-image shape="circle" mode="aspectFit" width="100%" height="90rpx" src="./static/img/more.png" @click="routeTo('task/detail', {planId: item.planId})"></u-image>
					<text class="tip">详 情</text>
				</view>
				<view class="item" v-if="item.repeat">
					<u-image shape="circle" mode="aspectFit" width="100%" height="90rpx" src="./static/img/delete.png" @click="overPlan(item.planId)"></u-image>
					<text class="tip">移 除</text>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
// -1：节点任务(无类型)  0：其他，1：学习，2：工作，3、出行，4：娱乐，5：运动，6：吃饭，7：睡觉
import { mapGetters } from 'vuex';
export default {
	name: 'task-manage',
	data() {
		return {};
	},
	computed: {
		...mapGetters(['userId'])
	},
	props: {
		taskArray: {
			type: Array,
			default: () => {
				return [];
			}
		},
		listStyle: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	methods: {
		getTagBg(type) {
			switch(type) {
				case -1: return 'bg-red'
				case 0: return 'bg-grey'
				case 1: return 'bg-blue'
				case 2: return 'bg-purple'
				case 3: return 'bg-green'
				case 4: return 'bg-yellow'
				case 5: return 'bg-green'
				case 6: return 'bg-yellow'
				case 7: return 'bg-cyan'
			}
		},
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
		getIconUrl(type) {
			return require(`./static/img/${type}.png`)
		},
		padString(str) {
			str = str.toString()
			return str.padStart(2, '0')
		},
		routeTo(path, params = {}, type = 'navigateTo') {
			// 使用uView的跳转（传参数方便）
			// 由于参数中有对象，因此先json化
			this.$u.route({
				type,
				url: `pages/${path}`,
				params
			})
		},
		overPlan(planId) {
			this.$apis.upDataRepeat({
				userId: this.userId, 
				planId, 
				repeat: false
			}).then(res => {
				let data = res.data;
				if (data.code === 200) {
					this.$refs.uToast.show({
						title: '移除成功！',
						type: 'success'
					})
					this.$emit('detachPlan', planId)
				}
			}).catch(err => {
				this.$refs.uToast.show({
					title: err,
					type: 'error'
				})
			})
		}
	}
};
</script>

<style lang="scss">
	@import "./static/css/tag.css";
	.list {
		padding: 0 20rpx;
		margin-top: 20rpx;
		position: relative;
	}
	.text-blue {
		color: #409EFF;
	}
	.text-gray {
		color: #909399;
	}
	.text-gren {
		color: #19be6b;
	}
	.bgc-blue {
		background-color: #409EFF;
	}
	.bgc-gray {
		background-color: #c8c9cc;
	}
	.bgc-gren {
		background-color: #19be6b;
	}
	.bold {
		// font-size: 32rpx;
		font-weight: bold;
	}
	.tip {
		color: #909399;
	}
	.text {
		color: #303133;
	}
	.line {
		margin-bottom: 24rpx;
	}
	.line:last-of-type {
		margin-bottom: 0rpx;
	}
	.card {
		width: 100%;
		margin: 20rpx 0;
		min-height: 300rpx;
		border-radius: 10rpx;
		box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, 0.1);
		background-color: #ffffff;
		.head {
			padding: 30rpx 25rpx 30rpx 0;
			border-bottom: 1rpx solid #F6F6F6;
			display: flex;
			.color {
				width: 12rpx;
				// background-color: #409EFF;
			}
			.title {
				flex: 5;
				font-size: 32rpx;
				font-weight: bold;
				margin-left: 20rpx;
			}
			.type {
				flex: 1;
				font-weight: bold;
				text-align: right;
			}
		}
		.content {
			padding: 30rpx 25rpx;
			color: #303133;
			.type-time {
				display: flex;
				flex: 1;
				.type {
					flex: 1;
				}
				.time {
					flex: 1;
					text-align: right;
				}	
			}
			.repeat-line {
				display: flex;
				.item {
					flex: 1;
				}
			}
		}
		.btns {
			display: flex;
			padding: 20rpx 25rpx;
			border-top: 1rpx solid #F6F6F6;
			justify-content: space-around;
			.item {
				width: 100%;
				text-align: center;
				// .tip {
				// 	display: block;
				// 	margin-top: 10rpx;
				// }
			}
		}
	}
</style>
