<template>
	<view class="wrap">
		<u-navbar :background="{ backgroundColor: '#ffffff' }" title-color="#303133" title-size="30" :border-bottom="false" title="每日总结"></u-navbar>
		<view class="content">
			<view class="card">
				<view class="line">
					<view class="line-item">
						<text class="item-tip">日期：</text>
						<text class="item-text">{{date}}</text>
					</view>
				</view>
				<view class="line">
					<view class="line-item">
						<u-icon class="item-icon" name="info-circle" color="#909399" size="34"></u-icon>
						<text class="item-label" v-if="edit">总结的修改不包括目标执行数量。</text>
						<text class="item-label" v-else>当日后续新增的任务、目标将不再被计入总结。</text>
					</view>
				</view>
			</view>
			<template v-if="cur === 1">
				<view class="card">
					<u-collapse>
						<u-collapse-item title="任务列表" :open="true">
							<template v-if="taskArray.length">
								<view class="list-tip">
									<text>选择执行过的任务</text>
								</view>
								<view class="list">
									<view class="list-item" :class="[item.checked ? 'list-active-item' : '']" v-for="(item, i) in taskArray" :key="item.planId" @click="checkTask(i)">
										<text>{{item.title}}</text>
									</view>
								</view>
							</template>
							<view class="null" v-else>
								<text>无执行任务</text>
							</view>
						</u-collapse-item>
					</u-collapse>
				</view>
				<view class="card" v-if="edit === 0">
					<u-collapse ref="targetColl">
						<u-collapse-item title="目标列表" :open="false">
							<template v-if="targetArray.length">
								<view class="list-tip">
									<text>输入目标执行数量</text>
								</view>
								<view class="list">
									<view class="list-item" v-for="(item, i) in targetArray" :key="item.targetId">
										<text class="list-item-text">{{item.title}}</text>
										<u-number-box v-if="edit" class="list-item-box" v-model="item.num" :min="min" :max="item.max" :index="i" @change="numChange"></u-number-box>
										<u-number-box v-else class="list-item-box" v-model="item.num" :min="min" :max="item.max" :index="i" @change="numChange"></u-number-box>
									</view>
								</view>
							</template>
							<view class="null" v-else>
								<text>无执行目标</text>
							</view>
						</u-collapse-item>
					</u-collapse>
				</view>
				<u-button :hairLine="false" type="primary" shape="circle" @click="cur = 2">下一步</u-button>
			</template>
			<template v-else>
				<view class="card">
					<view class="title">
						<text>自我评价</text>
					</view>
					<view class="list-line">
						<text class="list-line-left">自我打分</text>
						<u-number-box class="list-line-right" v-model="fraction" :min="min" :max="max"></u-number-box>
					</view>
				</view>
				<view class="card">
					<view class="title">
						<text>文字总结</text>
					</view>
					<view class="line-item">
						<u-input v-model="content" type="textarea" placeholder="请输入200字以内文字总结"  height="200" maxlength="200" :auto-height="false" />
					</view>
				</view>
				<u-button :hairLine="false" shape="circle" style="margin-bottom: 25rpx;" @click="cur = 1">上一步</u-button>
				<u-button :hairLine="false" type="primary" shape="circle" @click="modal = true">提 交</u-button>
			</template>
		</view>
		<u-modal v-model="modal" content="是否已确认总计内容无误？" :show-cancel-button="true" @confirm="submit" @cancel="modal = false"></u-modal>
		<u-toast ref="uToast"/>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				min: 0,
				max: 100,
				edit: 0,
				cur: 1,
				date: '',
				modal: false,
				taskArray: [],
				targetArray: [],
				fraction: 60,
				content: ''
				
			}
		},
		computed: {
			...mapGetters(['userId'])
		},
		methods: {
			checkTask(i) {
				this.taskArray[i].checked = !this.taskArray[i].checked
			},
			numChange({value, index}) {
				if (value > this.targetArray[index].max) {
					this.$refs.uToast.show({title: '输入数值已超过最大值！'})
					return false
				}
			},
			queryTarget() {
				this.$apis.queryTargetByParm({
					userId: this.userId,
					parm: {
						type: 1,
						numType: 0,
						status: 0
					}
				}).then(({data}) => {
					if (data.code === 200) {
						this.targetArray = data.data.map(item => {
							return {
								...item,
								max: item.num,
							}
						})
						// 刷新折叠面板内高度
						this.$nextTick(() => {
							this.$refs.targetColl.init()
						})
					} else {
						this.$refs.uToast.show({title: data.message})
					}
				}).catch(err => {
					this.$refs.uToast.show({title: '服务器开小差了'})
				})
			},
			submit() {
				if (this.edit) {
					this.upDataSummary()
				} else {
					this.submitSummary()
				}
			},
			submitSummary() {
				if (!this.userId) {
					return this.$refs.uToast.show({title: '用户未登录！'})
				}
				let obj = {
					userId: this.userId,
					date: this.date,
					fraction: this.fraction,
					content: this.content,
					taskArray: this.taskArray,
					targetArray: this.targetArray.map(item => {
						return {
							targetId: item.targetId,
							title: item.title,
							numType: item.numType,
							curNum: item.curNum,
							addNum: item.num,
							unit: item.unit,
							date: this.date
						}
					})
				}
				
				this.$apis.createSummary(obj).then(({data}) => {
					if (data.code === 200) {
						this.$refs.uToast.show({
							title: '创建成功',
							type: 'success',
							callback: ()=> {
								uni.navigateBack()
							}
						})
					}
				}).catch(err => {
					this.$refs.uToast.show({title: '服务器开小差了'})
				})
			},
			upDataSummary() {
				if (!this.userId) {
					return this.$refs.uToast.show({title: '用户未登录！'})
				}
				let summary = {
					userId: this.userId,
					date: this.date,
					fraction: this.fraction,
					content: this.content,
					taskArray: this.taskArray
				}
				this.$apis.upDataSummary(summary).then(({data}) => {
					if (data.code === 200) {
						this.$refs.uToast.show({
							title: '操作成功！',
							type: 'success',
							callback: ()=> {
								uni.navigateBack()
							}
						})
					}
				}).catch(err => {
					this.$refs.uToast.show({title: '服务器开小差了'})
				})
			}
		},
		onLoad(option) {
			this.edit = Number(option.edit)
			this.date = option.date
			if (this.edit) {
				let summary = JSON.parse(option.summary)
				this.taskArray = summary.taskArray
				this.fraction = summary.fraction
				this.content = summary.content
			} else {
				this.taskArray = JSON.parse(option.taskArray)
				this.queryTarget()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		height: 100vh;
		background-color: #fafafa;
		position: relative;
		.content {
			padding: 30rpx 25rpx;
		}
	}
	.step {
		width: 100%;
		background-color: #FFFFFF;
		padding: 20rpx 0;
	}
	.card {
		width: 100%;
		padding: 30rpx 25rpx;
		margin-bottom: 25rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, 0.1);
		.null {
			width: 100%;
			height: 120rpx;
			line-height: 120rpx;
			color: #909399;
			text-align: center;
		}
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
					font-weight: bold;
				}
				.item-icon {
					vertical-align: middle;
					margin-right: 6rpx;
				}
				.item-label {
					font-size: 26rpx;
					color: #909399;
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
		&-line {
			margin-top: 20rpx;
			display: flex;
			&-left {
				flex: 3;
			}
			&-right {
				flex: 3;
				display: flex;
				justify-content: flex-end;
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
	::v-deep .u-collapse-head {
		font-weight: bold;
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
</style>
