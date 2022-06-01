<template>
	<view class="list" v-if="taskArray.length" :style="listStyle">
		<view class="card" v-for="(item, i) in taskArray" :key="i">
			<view class="info">
				<view class="content">
					<view class="top">
						<view class="type">
							<view class="type-icon">
								<view class="cu-tag sm radius" :class="getTagBg(item.type)">
									{{getTagText(item.type)}}
								</view>
							</view>
						</view>
						<view class="time">
							<view class="start time-text">
								<text>{{padString(item.startTime.hour)}}:{{padString(item.startTime.minute)}}</text>
							</view>
							<view class="total">
								<view class="left">
									<image mode="aspectFit" src="./static/img/dot.png" style="width: 100%; height: 100%;"></image>
								</view>
								<view class="content" v-if="item.node">
									<text>到点执行</text>
								</view>
								<view class="content" v-else>
									<text>{{getTotal(item.startTime, item.endTime)}}</text>
								</view>
								<view class="right">
									<image mode="aspectFit" src="./static/img/dot.png" style="width: 100%; height: 100%;transform: rotate(180deg);"></image>
								</view>
							</view>
							<view class="time-text end">
								<text>{{padString(item.endTime.hour)}}:{{padString(item.endTime.minute)}}</text>
							</view>
						</view>
					</view>
					<view class="bottom">
						<view class="left line-center">
							<view class="left-item line-center icon"><image mode="aspectFit" :src="getIconUrl(item.type)" style="width: 100%; height: 100%;"></image></view>
						</view>
					
						<view class="right">
							<view class="title"><text>{{item.title}}</text></view>
							<view class="remarks" v-if="item.remarks"><text>{{item.remarks}}</text></view>
						</view>
					</view>
				</view>
				
			</view>
			<view class="address" v-if="item.address">
				<text class="iconfont icon-address" style="font-size: 20px;margin-right: 12rpx;"></text>
				<text class="address-text">{{item.address}}</text>
			</view>
		</view>
	</view>
	<u-empty text="今日无任务" mode="favor" margin-top="100" icon-size ="250" src="../../static/img/null/list-null.png" v-else></u-empty>
</template>

<script>
// -1：节点任务(无类型)  0：其他，1：学习，2：工作，3、出行，4：娱乐，5：运动，6：吃饭，7：睡觉
export default {
	name: 'task-card',
	data() {
		return {};
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
		getIconUrl(type) {
			return require(`./static/img/${type}.png`)
		},
		padString(str) {
			str = str.toString()
			return str.padStart(2, '0')
		},
		getTotal(a, b) {
			let h = b.hour - a.hour
			let m = b.minute - a.minute
			if ( m < 0) {
				return `${h - 1}时${m + 60}分`
			}
			return `${h}时${m}分`
		},
		routeTo(path, params = {}, type = 'navigateTo') {
			// 使用uView的跳转（传参数方便）
			// 由于参数中有对象，因此先json化
			this.$u.route({
				type,
				url: `pages/${path}`,
				params
			})
		}
	}
};
</script>

<style lang="scss">
@import './static/icon/iconfont.css';
/* tag css */
@import "./static/css/tag.css";
.blue {
	background-color: #447ef7;
	color: #ffffff;
}
.line-center {
	display: flex;
	justify-content: center;
	align-items: center;
}

.null-box {
	width: 70%;
	height: 400rpx;
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

.list {
	position: relative;
	margin-top: 25rpx;
	.card {
		width: 100%;
		margin: 20rpx 0;
		min-height: 180rpx;
		border-radius: 12rpx;
		// box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, 0.1);
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		background-color: #ffffff;
		overflow: hidden;
		/*card最外层*/
		.info {
			display: flex;
			padding: 30rpx 25rpx;
		}
		.address {
			border-top: 1rpx solid #F6F6F6;
			padding:25rpx;
			.address-text {
				color: #606266;
				font-size: 28rpx;
			}
		}
		/*info内层*/
		.content {
			flex: 8;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
		.edit {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			align-items: center;
		}
		
		/*content内层*/
		.top {
			display: flex;
			margin-bottom: 15rpx;
			.type {
				flex: 2;
				text-align: center;
				.type-icon {
					padding-right: 30rpx;
				}
			}
			.time {
				flex: 7;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.time-text {
					font-size: 32rpx;
					letter-spacing: 1rpx;
					font-weight: bold;
				}
				.start {
					flex: 1;
				}
				.total {
					flex: 3;
					height: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.left {
						flex: 3;
						height: 100%;
					}
					.content {
						flex: 4;
						height: 100%;
						font-size: 26rpx;
						text-align: center;
						color: #303133;
					}
					.right {
						flex: 3;
						height: 100%;
					}
				}
				.end {
					flex: 1;
				}
			}
		}
		.bottom {
			display: flex;
			.left {
				flex: 2;
				text-align: center;
				.left-item {
					height: 90rpx;
					padding: 0rpx 30rpx 0rpx 0rpx;
				}
				.time {
					font-size: 32rpx;
					letter-spacing: 2rpx;
					font-weight: bold;
				}

				.icon {
					width: 100%;
					position: relative;
				}
			}
			.right {
				flex: 7;
				// height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				
				.title {
					font-size: 32rpx;
					font-weight: bold;
				}
				.remarks {
					font-size: 28rpx;
					color: #909399;
					margin-top: 4rpx;
				}
			}
		}
	}
}
</style>
