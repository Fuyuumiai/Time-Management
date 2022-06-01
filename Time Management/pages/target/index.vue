<template>
	<view class="wrap">
		<u-navbar :background="{ backgroundColor: '#ffffff' }" :is-back="false" :border-bottom="false">
			<view class="slot-wrap">
				<view class="navbar-left"><u-icon class="left-icon" name="../../static/btnIcon/0.png" size="40" color="#909399" @click="routeTo('target/calendar')"/></view>
				<view class="navbar-text"><text>目标管理</text></view>
				<view class="navbar-right"><u-icon class="right-icon" name="../../static/btnIcon/3.png" size="40" color="#909399" @click="choose = true" /></view>
			</view>
		</u-navbar>
		<u-gap height="12" bg-color="#fafafa"></u-gap>
		<view class="item">
			<u-section v-if="activeTarget.length" title="进行中" line-color="#2979ff" sub-title="查看更多" @click="routeTo('target/list', {status: 0})"></u-section>
			<u-section v-else title="进行中" line-color="#2979ff" :right="false"></u-section>
			<view class="target" v-if="activeTarget.length">
				<view class="target-box" v-for="(item, i) in activeTarget" :key="i"  @click="popupSelect(i)">
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
				<view class="target-box" v-if="activeSize > 3">
					<view class="content">
						<view class="title">
							<text>其余目标数量</text>
						</view>
						<view class="num">
							<text class="blod">{{ activeSize - 3 }}</text>
							<text class="tip">个</text>
						</view>
						<view class="link" @click="routeTo('target/list', {status: 0})">
							<text>查看更多</text>
							<u-icon name="arrow-right" color="#909399" size="26" ></u-icon>
						</view>
					</view>
					<view class="bg num-bg">
						<u-image shape="circle" mode="aspectFit" width="100%" height="100%" src="../../static/img/target/more.png"></u-image>
					</view>
				</view>
			</view>
			<view class="null-box" v-else>
				<u-empty text="这里空空如也~" mode="favor" margin-top="20" icon-size ="300" src="../../static/img/null/target-null.png"></u-empty>
				<u-button class="null-btn"  :hairLine="false" shape="circle" type="primary" @click="choose = true">添加任务</u-button>
			</view>
		</view>
		<u-gap height="12" margin-top="15" margin-bottom="15" bg-color="#fafafa"></u-gap>
		<view class="item">
			<u-section v-if="endTarget.length" title="已结束" line-color="#2979ff" sub-title="查看更多" @click="routeTo('target/list', {status: 1})"></u-section>
			<u-section v-else title="已结束" line-color="#2979ff" :right="false"></u-section>
			<view class="target" v-if="endTarget.length">
				<view class="target-box" v-for="(item, i) in endTarget" :key="i" @click="popupSelect(i, 1)">
					<view class="title">
						<text>{{ item.title }}</text>
					</view>
					<template v-if="item.type === 1">
						<view class="tip">
							<text class="bold">{{ item.curNum }}</text>
							<text>/{{item.num }}{{ item.unit }}</text>
						</view>
						<view class="progress"><u-line-progress active-color="#2979ff"  :percent="handlePercent(item.curNum, item.num)"></u-line-progress></view>
					</template>
					<view class="tip" style="margin-top: 10rpx;" v-if="item.overdue">
						截止日期：<text class="bold">{{ item.endTime.result }}</text>
					</view>
					<view class="finsh-bg num-bg" v-if="item.overdue">
						<u-image shape="circle" mode="aspectFit" width="100%" height="100%" src="../../static/img/target/end.png"></u-image>
					</view>
					<view class="finsh-bg num-bg" v-else>
						<u-image shape="circle" mode="aspectFit" width="100%" height="100%" src="../../static/img/target/finish.png" v-if="item.finish"></u-image>
						<u-image shape="circle" mode="aspectFit" width="100%" height="100%" src="../../static/img/target/unfinish.png" v-else></u-image>
					</view>
				</view>
				<view class="target-box" v-if="endSize > 5">
					<view class="content">
						<view class="title">
							<text>其余目标数量</text>
						</view>
						<view class="num">
							<text class="blod">{{ endSize - 5 }}</text>
							<text class="tip">个</text>
						</view>
						<view class="link" @click="routeTo('target/list', {status: 1})">
							<text>查看更多</text>
							<u-icon name="arrow-right" color="#909399" size="26" ></u-icon>
						</view>
					</view>
					<view class="bg num-bg">
						<u-image shape="circle" mode="aspectFit" width="100%" height="100%" src="../../static/img/target/more.png"></u-image>
					</view>
				</view>
			</view>
			<view class="null-box" v-else>
				<u-empty text="这里空空如也~" mode="favor" margin-top="20" icon-size ="300" src="../../static/img/null/end-target-null.png"></u-empty>
			</view>
		</view>
		<u-popup width="600" height="auto" border-radius="16" v-model="popupShow" mode="center">
			<view class="popup-content">
				<view class="content-top">
					<view class="title">
						<text style="margin-right: 10rpx;">{{onSelect.title}}</text>
						<template v-if="onSelect.status">
							<u-tag class="title-icon" text="完成" mode="light" size="mini" v-if="onSelect.finish" />
							<u-tag class="title-icon" text="未完成" type="info" mode="light" size="mini" v-else />
						</template>
						<template v-else>
							<u-tag class="title-icon" text="倒计时" mode="light" size="mini" v-if="onSelect.type == 0" />
							<u-tag class="title-icon" text="每日执行" type="warning" mode="light" size="mini" v-else-if="onSelect.numType == 0" />
							<u-tag class="title-icon" text="长期计划" type="success" mode="light" size="mini" v-else-if="onSelect.numType == 1" />
						</template>
					</view>
					<view class="box" v-if="onSelect.type == 0">
						<view class="text">
							<text class="tip">截止日期：</text>
							<text class="time">{{onSelect.endTime.result}}</text>
						</view>
					</view>
					<view class="box"  v-else-if="onSelect.numType == 0">
						<view class="text">
							<text class="tip">每日完成：</text>
							<text class="num">{{onSelect.num}}</text>
							<text class="unit">{{onSelect.unit}}</text>
						</view>
					</view>
					<view class="box" v-else-if="onSelect.numType == 1">
						<view class="time-text" v-if="onSelect.endTime.result">
							<text class="tip">截止日期：</text>
							<text class="time">{{onSelect.endTime.result}}</text>
						</view>
						<u-circle-progress active-color="#2979ff" :percent="handlePercent(onSelect.curNum, onSelect.num)" width="320" border-width="25">
							<view class="u-progress-content">
								<view class="u-progress-dot"></view>
								<text class="u-progress-info">{{handlePercent(onSelect.curNum, onSelect.num)}}%</text>
							</view>
						</u-circle-progress>
						<view class="box-text">
							<view class="item">
								<view class="figure"><u-count-to font-size="42" start-val="0" :end-val="onSelect.curNum"></u-count-to></view>
								<view class="text">
									<text>{{onSelect.status ? '完成值' : '当前值'}}</text>
								</view>
							</view>
							<view class="item">
								<view class="figure"><u-count-to :autoplay="false" font-size="42" :start-val="onSelect.num" :end-val="onSelect.num"></u-count-to></view>
								<view class="text">
									<text>目标值</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="btns" v-if="onSelect.status === 0">
					<view class="btn-item">
						<u-icon :name="imgUrl.edit" size="40" @click="editTarget"></u-icon>
					</view>
					<view class="btn-item" v-if="onSelect.numType == 1">
						<u-icon :name="imgUrl.upload" size="40" @click="numberBox = true"></u-icon>
					</view>
					<view class="btn-item" v-if="onSelect.numType == 1">
						<u-icon :name="imgUrl.finsh" size="40" @click="content = true"></u-icon>
					</view>
					<view class="btn-item" v-if="onSelect.type == 0 || onSelect.numType == 0">
						<u-icon :name="imgUrl.delete" size="40" @click="handleCancel"></u-icon>
					</view>
				</view>
			</view>
		</u-popup>
		<u-popup v-model="numberBox"  mode="center" width="430rpx" height="auto" border-radius="12">
			<view class="number-box">
				<view class="box-title">
					<text>添加完成量</text>
				</view>
				<view class="box-handle">
					<u-number-box  :min="min" :max="onSelect.num - onSelect.curNum" input-width="210" input-height="70" v-model="selectNum" ></u-number-box>
				</view>
				<view class="tip">
					<text>注意：累加值超过目标量将视作已完成!</text>
				</view>
				<u-button style="height: 32px;" type="primary" @click="hadleNumber">确 认</u-button>
			</view>
		</u-popup>
		<u-modal v-model="content" :show-cancel-button="true"   @confirm="handleFinsh" @cancel="content = false">
			<u-cell-group :border="false" style="padding: 20rpx 0;">
				<u-cell-item :border-bottom="false" :arrow="false" :title-style="cellStyle" title="是否视作完成">
					<view  solt="right-icon">
						<u-switch v-model="check"></u-switch>
					</view>
				</u-cell-item>
			</u-cell-group>
		</u-modal>
		<u-popup v-model="choose" mode="center" width="80%" height="auto" border-radius="12" @close="popupClose">
			<view class="choose">
				<view class="choose-title">
					<text>请选择你要创建的目标类型</text>
				</view>
				<view class="choose-btns">
					<view class="choose-btns-item" :class="[chooseNum === 0 ? 'item-scale' : '']">
						<u-image shape="circle" mode="aspectFit" width="100%" height="100rpx" src="../../static/img/icon/target_num.png" @click="chooseType(0)"></u-image>
						<text class="tip">时间目标</text>
					</view>
					<view class="choose-btns-item" :class="[chooseNum === 1 ? 'item-scale' : '']">
						<u-image shape="circle" mode="aspectFit" width="100%" height="100rpx" src="../../static/img/icon/target_more.png" @click="chooseType(1)"></u-image>
						<text class="tip">数量目标</text>
					</view>
				</view>
				<view class="choose-tip">
					<text class="choose-tip-text" v-if="chooseNum === 0">时间目标：创建一个目标事件的倒计时</text>
					<text class="choose-tip-text" v-else-if="chooseNum === 1">数量目标：创建一个指定数量及单位的目标</text>
				</view>
				<view class="choose-bottom">
					<u-button v-if="chooseNum === -1" :disabled="true" :hairLine="false" shape="circle" type="primary">确 认</u-button>
					<u-button v-else :hairLine="false" shape="circle" type="primary"  @click="routeTo('target/handleTarget', {type: chooseNum, edit: 0})">确 认</u-button>
				</view>
			</view>
		</u-popup>
		<u-modal v-model="modal" content="是否放弃当前内容？" :show-cancel-button="true" @confirm="deleteTarget(onSelect.targetId)" @cancel="handleCancel"></u-modal>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	data() {
		return {
			toDay: new Date(),
			imgUrl:{
				edit: '/static/target/edit.png',
				finsh: '/static/target/finsh.png',
				delete: '/static/target/delete.png',
				upload: '/static/target/upload.png'
			},
			cellStyle: {
				fontSize: '30rpx',
				fontWeight: 'bold',
				color: '#303133'
			},
			choose: false,
			chooseNum: -1,
			onSelect: {},
			onSelectIndex: -1,
			check: false,
			min: 1,
			selectNum: 1,
			modal: false,
			content: false,
			popupShow: false,
			numberBox: false,
			activeTarget: [],
			activeSize: 0,
			endTarget: [],
			endSize: 0
		};
	},
	computed: {
		...mapGetters(['userId'])
	},
	onShow() {
		this.queryActiveTarget()
		this.queryEndTarget()
	},
	methods: {
		// 前往其他页面
		routeTo(path, params = {}, type = 'navigateTo') {
			if (this.choose) {
				this.choose = false
				this.chooseNum = -1
			}
			// 使用uView的跳转（传参数方便）
			this.$u.route({
				type,
				url: `pages/${path}`,
				params
			});
		},
		chooseType(num) {
			this.chooseNum = num
		},
		popupClose() {
			this.chooseNum = -1
		},
		handlePercent(end, num) {
			return Math.ceil((end / num) * 100)
		},
		handleCancel() {
			this.modal = !this.modal
		},
		// 获取一个时间与当前时间之间差距的日期
		getTimeVal(t) {
			let t1 = this.toDay.getTime()
			let t2 = new Date(t).getTime()
			let date = t2 - t1
			return parseInt(date / (1000 * 60 * 60 * 24))
		},
		popupSelect(i, type = 0){
			let arr = type === 0 ? 'activeTarget' : 'endTarget'
			if (type) {
				if (this[arr][i].numType !== 1) {
					return
				}
			}
			this.onSelect = this[arr][i]
			this.onSelectIndex = i
			this.popupShow = true
		},
		editTarget(){
			this.popupShow = false
			this.routeTo('target/handleTarget', {type: this.onSelect.type, target: JSON.stringify(this.onSelect), edit: 1})
		},
		fundById(arr, id) {
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].planId === id) {
					return i
				}
			}
			return -1
		},
		getTargetById(targetId, type = 0) {
			this.$apis.getTargetById(targetId).then(({data}) => {
				if (data.code === 200) {
					let self = type === 0 ? this.activeTarget : this.endTarget
					let i = this.fundById(self, planId)
					if (i !== -1) {
						this.$set(self, i, data.data)
					} else {
						self.unshift(data.data)
					}
				} else {
					this.$refs.uToast.show({title: data.message})
				}
			}).catch(() => {
				this.$refs.uToast.show({title: '服务器开小差了'})
			})
		},
		handleFinsh(){
			this.onSelect.status = 1
			this.onSelect.finish = this.check
			this.$apis.upDataTarget({
				target: Object.assign(this.onSelect, { userId: this.userId }),
				handleNum: true
			}).then(res => {
				if (res.data.code === 200) {
					this.onSelect = {}
					this.content = false
					this.check = false
					this.popupShow = false
					this.queryActiveTarget()
					this.queryEndTarget()
				} else {
					this.$refs.uToast.show({title: res.data.message})
				}
			}).catch(() => {
				this.$refs.uToast.show({title: '服务器开小差了'})
			})
		},
		hadleNumber(){
			let target = JSON.parse(JSON.stringify(this.onSelect))
			let type = 0 
			target.curNum = target.curNum + this.selectNum
			target.addNum = this.selectNum
			if (target.curNum === target.num) {
				target.finish = true
				target.status = 1
				type = 1
			}
			
			this.$apis.upDataTarget({
				target: Object.assign(target, { userId: this.userId }),
				handleNum: true
			}).then(res => {
				if (res.data.code === 200) {
					this.numberBox = false
					this.selectNum = 1
					this.$set(this.onSelect, 'curNum', target.curNum)
					if (target.finish) {
						this.activeTarget.splice(this.onSelectIndex, 1)
					}
					this.getTargetById(target.targetId, type)
				} else {
					this.$refs.uToast.show({title: res.data.message})
				}
			}).catch(() => {
				this.$refs.uToast.show({title: '服务器开小差了'})
			})
		},
		deleteTarget(targetId) {
			this.popupShow = false
			this.$apis.deleteTarget({targetId}).then(res => {
				if (res.data.code === 200) {
					this.$refs.uToast.show({
						title: '删除成功',
						type: 'success',
						callback: ()=> {
							this.queryActiveTarget()
						}
					})
				} else {
					this.$refs.uToast.show({title: res.data.message})
				}
			}).catch(err => {
				this.$refs.uToast.show({title: '服务器开小差了'})
			})
		},
		// 请求未结束目标
		queryActiveTarget(){
			if (this.userId) {
				this.$apis.queryTypeTarget({userId: this.userId, status: 0, page: 1, num: 3}).then(({data}) => {
					if (data.code === 200) {
						this.activeTarget = data.data.list
						this.activeSize = data.data.size
					} else {
						this.$refs.uToast.show({title: data.message})
					}
				}).catch(err => {
					this.$refs.uToast.show({title: '服务器开小差了'})
				})
			}
		},
		// 请求结束目标
		queryEndTarget(){
			if (this.userId) {
				this.$apis.queryTypeTarget({userId: this.userId, status: 1, page: 1, num: 5}).then(res => {
					if (res.data.code === 200) {
						this.endTarget = res.data.data.list
						this.endSize = res.data.data.size
					} else {
						this.$refs.uToast.show({title: res.data.message})
					}
				}).catch(err => {
					this.$refs.uToast.show({title: '服务器开小差了'})
				})
			}
		},
		// 判断指定id的对象在对象数组中的位置
		fundById(arr, id) {
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].targetId === id) {
					return i
				}
			}
			return -1
		},
		// 根据ID获取目标
		getTargetById(targetId) {
			this.$apis.getPlanById({
				userId: this.userId,
				targetId
			}).then(({data}) => {
				if (data.code === 200) {
					let date = data.data
					let i = this.fundById(this.activeTarget, targetId)
					if (i !== -1) {
						this.$set(this.activeTarget, i, date)
					} else {
						this.activeTarget.unshift(date)
					}
				}
			}).catch(err => {
				this.$refs.uToast.show({
					title: '服务器开小差了o(╥﹏╥)o',
					type: 'error'
				})
			})
		}
	}
};
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
		padding: 30rpx 0 0 0;
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
// .target-mask {
// 	width: 100%;
// 	height: 100%;
// 	position: absolute;
// 	top: 0;
// 	right: 0;
// 	border-radius: 12rpx;
// 	background-color: rgba(0, 0, 0, 0.6);
// 	z-index: 10070;
// 	transition: all .1s ease-in-out;
// 	transform: scale(1.1);
// 	.mask-content {
// 		width: 100%;
// 		height: 100%;
// 		display: flex;
// 		align-items: center;
// 		justify-content: space-around;
// 	}
// }
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

.slot-wrap,
.navbar-left,
.navbar-right {
	display: flex;
	flex: 1;
	justify-content: center;
}
.navbar-left {
	justify-content: flex-start;
	.left-icon {
		padding-left: 40rpx;
	}
}
.navbar-text {
	font-size: 30rpx;
}
.tab-wrap {
	font-size: 30rpx;
}

.navbar-right {
	justify-content: flex-end;
	.right-icon {
		padding-right: 40rpx;
	}
}
.choose {
	padding: 36rpx 30rpx;
	&-title {
		text-align: center;
		font-size: 30rpx;
		font-weight: bold;
		color: #303133;
	}
	&-btns {
		margin: 36rpx 0 20rpx 0;
		display: flex;
		&-item {
			flex: 1;
			text-align: center;
			position: relative;
			.tip {
				display: inline-block;
				color: #606266;
				margin-top: 12rpx;
			}
		}
		.item-scale {
			transform: scale(1.1);
			transition: all 0.2s linear;
		}
	}
	&-tip {
		text-align: center;
		color: #909399;
		font-size: 26rpx;
		&-text {
			display: inline-block;
			margin-top: 4rpx;
		}
	}
	&-bottom {
		width: 90%;
		margin-left: 5%;
		margin-top: 40rpx;
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
.null-btn {
	width: 60%;
	margin: 20rpx auto 40rpx;
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
::v-deep .u-btn--primary {
	background-color: #409EFF;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
