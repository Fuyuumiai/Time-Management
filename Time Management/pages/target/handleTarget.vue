<template>
	<view class="wrap">
		<u-navbar :background="{ backgroundColor: '#fff' }" :is-back="false" :border-bottom="false">
			<view class="slot-wrap">
				<view class="navbar-left"><u-icon class="left-icon" name="close" size="37" color="#000" @click="handleCancel" /></view>
				<view class="title"><text>{{title}}</text></view>
				<view class="navbar-right"><u-icon class="right-icon" name="checkmark" size="44" color="#000" @click="handleSubmit" /></view>
			</view>
		</u-navbar>
		<u-gap height="10" bg-color="#fafafa"></u-gap>
		<!-- 数量目标 -->
		<view class="wrap-form" v-if="type">
			<u-form :model="numTarget" ref="uForm" label-position="top">
				<u-form-item label="标题" :required="true" :label-style="cellStyle" prop="title"><u-input v-model="numTarget.title" maxlength="12" placeholder="输入目标标题" /></u-form-item>
				<u-form-item label="数量" :required="true" :label-style="cellStyle" prop="num"><u-input v-model="numTarget.num" maxlength="10" type="number" placeholder="输入目标数量" /></u-form-item>
				<u-form-item label="单位" :required="true" :label-style="cellStyle" prop="unit"><u-input v-model="numTarget.unit" maxlength="6" placeholder="输入数量单位" /></u-form-item>
				<u-form-item label="类型" :required="true" :label-style="cellStyle" prop="type"><u-input v-model="numTarget.type.label" placeholder="选择目标类型" type="select" :select-open="selectShow" @click="selectShow = true"/></u-form-item>
				<view class="tip" v-if="numTarget.type.value >= 0">
					<text v-if="numTarget.type.value === 0">每日执行：该目标数量需每日执行</text>
					<text v-else-if="numTarget.type.value === 1">长期计划：该目标数量为长期执行后的最终结果</text>
				</view>
				<u-form-item v-if="numTarget.type.value === 1" label-position="left" label-width="160" label="截止时间" :label-style="cellStyle" ><u-input v-model="numTarget.endTime.result" type="select" :select-open="calendarShow" placeholder="可选择截止时间" @click="calendarShow = true"/></u-form-item>
			</u-form>
		</view>
		<!-- 时间目标 -->
		<view class="wrap-form" v-else>
			<u-form :model="timeTarget" label-position="top">
				<u-form-item label="标题" :required="true" :label-style="cellStyle" prop="title"><u-input v-model="timeTarget.title" maxlength="12" placeholder="输入目标标题" /></u-form-item>
				<u-form-item label-position="left" label-width="160" label="截止时间" :required="true" :label-style="cellStyle" prop="num"><u-input v-model="timeTarget.endTime.result" type="select" :select-open="calendarShow" placeholder="选择截止时间" @click="calendarShow = true"/></u-form-item>
			</u-form>
		</view>
		<u-modal v-model="modal" content="是否放弃以更改内容？" :show-cancel-button="true" @confirm="goBack" @cancel="handleCancel"></u-modal>
		<u-select v-model="selectShow" :list="selectList" @confirm="handleSelect"></u-select>
		<u-calendar v-model="calendarShow" mode="date" :min-date="getToday()" :max-date="getToday(3)"  @change="timeChange"></u-calendar>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				targetId: -1,
				submit: false,
				type: -1,
				edit: -1,
				title: '创建目标',
				modal: false,
				cellStyle: {
					fontSize: '30rpx',
					fontWeight: 'bold',
					color: '#303133'
				},
				selectShow: false,
				selectList: [
					{
						value: 0,
						label: '每日执行'
					},
					{
						value: 1,
						label: '长期计划'
					}
				],
				numTarget: {
					title: '',
					num: '',
					unit: '',
					type: {
						label: '',
						value: -1
					},
					endTime: {}
				},
				calendarShow: false,
				timeTarget: {
					title: '',
					endTime: {}
				},
				rules: {
					title: [
						{
							required: true,
							message: '请输入目标标题'
						}
					],
					num: [
						{
							required: true,
							message: '请输入目标值'
						}
					],
					unit: [
						{
							required: true,
							message: '请输入目标值单位'
						}
					]
				}
			}
		},
		computed: {
			...mapGetters(['userId'])
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack()
			},
			// 取消更改提示
			handleCancel() {
				this.modal = !this.modal
			},
			getToday(i = 0) {
				let t = new Date()
				return `${t.getFullYear() + i}-${t.getMonth() + 1}-${t.getDate()}`
			},
			timeChange(e) {
				let {year, month, day, result} = e
				let target = this.type === 0 ? this.timeTarget : this.numTarget
				target.endTime = {
					year,
					month,
					day,
					result
				}
			},
			handleSelect(data) {
				this.numTarget.type = data[0]
			},
			handleSubmit() {
				if (this.type) {
					this.handleNumTarget()
				} else {
					this.handleTimeTarget()
				}
			},
			handleTimeTarget() {
				if (this.timeTarget.title === '') {
					return this.$refs.uToast.show({title: '标题为空！'})
				}
				if (JSON.stringify(this.timeTarget.endTime) === '{}') {
					return this.$refs.uToast.show({title: '未选择截止时间！'})
				}
				if (!this.userId) {
					return this.$refs.uToast.show({title: '用户尚未登录！'})
				}
				if (this.edit) {
					this.upDataTarget(this.timeTarget)
				} else {
					this.createTarget(this.timeTarget)
				}
			},
			handleNumTarget() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						if (this.numTarget.type.value === -1) {
							return this.$refs.uToast.show({title: '未选择目标类型！'})
						}
						if (this.numTarget.num === 0) {
							return this.$refs.uToast.show({title: '目标值为0！'})
						}
						
						if (!this.userId) {
							return this.$refs.uToast.show({title: '用户尚未登录！'})
						}
						let target = {
							title: this.numTarget.title,
							num: Number(this.numTarget.num),
							unit: this.numTarget.unit,
							numType: this.numTarget.type.value,
							endTime: this.numTarget.endTime
						}
						
						if (this.edit) {
							this.upDataTarget(target)
						} else {
							this.createTarget(target)
						}
					}
				})
			},
			createTarget(target) {
				this.submit = true
				this.$apis.createTarget({
					...target,
					type: this.type,
					userId: this.userId
				}).then(({data}) => {
					if(data.code === 200){
						this.$refs.uToast.show({
							title: '创建成功',
							type: 'success',
							callback: ()=> {
								uni.navigateBack()
							}
						})
					} else {
						this.$refs.uToast.show({ title: data.message})
					}
				}).catch(() => {
					this.$refs.uToast.show({ title: '服务器开小差了~'})
				})
			},
			upDataTarget(target) {
				this.submit = true
				this.$apis.upDataTarget({
					target: Object.assign(target, { targetId: this.targetId, userId: this.userId })
				}).then(({data}) => {
					if(data.code === 200){
						this.$refs.uToast.show({
							title: '修改成功',
							type: 'success',
							callback: ()=> {
								uni.switchTab({
									url: '/pages/target/index',
									success: () => {
										let page = getCurrentPages().pop();
										if (page == undefined || page == null) return;
										page.$vm.queryActiveTarget();
									}
								})
							}
						})
					} else {
						this.$refs.uToast.show({ title: data.message})
					}
				}).catch(() => {
					this.$refs.uToast.show({ title: '服务器开小差了~'})
				})
			}
		},
		onReady() {
			if (this.type) {
				this.$refs.uForm.setRules(this.rules)
			}
		},
		onLoad(option) {
			this.type = Number(option.type)
			this.edit = Number(option.edit)
			
			if (this.edit) {
				this.title = '修改目标'
				let target = JSON.parse(option.target)
				this.targetId = target.targetId
				if (this.type === 0) {
					this.timeTarget = {
						title: target.title,
						endTime: target.endTime
					}
				} else {
					let obj = {
						title: target.title,
						num: target.num,
						unit: target.unit,
						type: {
							label: this.selectList[target.numType].label,
							value: target.numType
						}
					}
					if (target.numType) {
						obj.endTime = target.endTime
					}
					this.numTarget = obj
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		
	}
	.slot-wrap,
	.navbar-left,
	.navbar-right {
		display: flex;
		flex: 1;
		justify-content: center;
	}
	.title {
		flex: 5;
		display: flex;
		justify-content: center;
	}
	.wrap {
		padding: 0 5rpx;
		&-form {
			width: calc(100% - 60rpx);
			margin-left: 30rpx;
		}
		&-btn{
			width: calc(100% - 60rpx);
			margin: 80rpx 0 0 30rpx;
		}
	}
	::v-deep .u-btn--primary {
		background-color: #409EFF;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		margin-top: 35rpx;
	}
	.tip {
		margin: 20rpx 0;
		color: #909399;
		font-size: 26rpx;
	}
</style>
