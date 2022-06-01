 <template>
 	<view class="wrap">
 		<u-navbar :background="{ backgroundColor: '#fff' }" :is-back="false" :border-bottom="false">
 			<view class="slot-wrap">
 				<view class="navbar-left"><u-icon class="left-icon" name="close" size="37" color="#000" @click="handleCancel" /></view>
 				<view class="title"><text>{{ edit ? '修改任务':'创建任务' }}</text></view>
 				<view class="navbar-right"><u-icon class="right-icon" name="checkmark" size="44" color="#000" @click="handleConfirm" /></view>
 			</view>
 		</u-navbar>
 		<u-gap height="10" bg-color="#fafafa"></u-gap>
 		<!-- 基础信息 -->
 		<view class="base">
 			<u-input
 				class="base-input"
 				v-model="taskObj.title"
 				type="text"
 				placeholder="请输入事件标题"
 				maxlength="24"
 				:clearable="false"
 				:custom-style="inputStyle"/>
			<u-section class="base-section-text" font-size="32" :show-line="false" title="节点任务">
				<view slot="right">
					<u-switch v-model="taskObj.node"></u-switch>
				</view>
			</u-section>
			<view class="tip">
				<text>在指定时间点立即执行的任务</text>
			</view>
 		</view>
		<u-gap height="10" bg-color="#fafafa"></u-gap>
		<view class="base" v-if="taskObj.node">
			<u-section class="base-section" font-size="32" :show-line="false" title="执行时间" :sub-title="taskObj.nodeTime.title" @click="handlePickerShow(0)"></u-section>
		</view>
		<view class="base" v-else>
			<u-section class="base-section" font-size="32" :show-line="false" title="开始时间" :sub-title="taskObj.startTime.title" @click="handlePickerShow(0)"></u-section>
			<u-section class="base-section" font-size="32" :show-line="false" title="结束时间" :sub-title="taskObj.endTime.title" @click="handlePickerShow(1)"></u-section>
			<u-section class="base-section" font-size="32" :show-line="false" title="类型" :sub-title="taskObj.mold.title" @click="handleSelect(0)"></u-section>
		</view>
 		<u-gap height="10" bg-color="#fafafa"></u-gap>
 		<view class="base">
			<view class="tip" style="padding-top: 30rpx;" v-if="edit">
				<u-icon style="margin-right: 12rpx;" name="info-circle" color="#909399" size="32"></u-icon>
				<text>更改当前循环设置，任务将从新开始</text>
			</view>
 			<u-section class="base-section" font-size="32" :show-line="false" title="循环">
 				<view slot="right">
 					<u-switch v-model="taskObj.repeat.status"></u-switch>
 				</view>
 			</u-section>
			
 			<u-section v-if="taskObj.repeat.status" class="base-section" font-size="32" :show-line="false" title="频率" :sub-title="taskObj.repeat.rate.title" @click="handleSelect(1)"></u-section>
 			<u-section v-if="taskObj.repeat.status" class="base-section" font-size="32" :show-line="false" title="周期" :sub-title="taskObj.repeat.unit.title" @click="handleSelect(2)"></u-section>
			<u-section v-if="taskObj.repeat.status" class="base-section" font-size="32" :show-line="false" title="次数" :sub-title="taskObj.repeat.num.title" @click="handleSelect(3)"></u-section>
			<view class="tip" v-if="taskObj.repeat.status">
				<text>{{tipText}}</text>
			</view>
			<template v-if="taskObj.repeat.status">
				<view class="check" v-if="taskObj.repeat.rate.title==='周'">
					<view class="tip">
						<text>选择执行时间</text>
					</view>
					<u-row gutter="16" class="check-row">
						<u-col span="3" text-align="center"  class="check-col" :class="{'active-col': judgeIn(i)}"  v-for="i in 7" :key="i" @click="hanleWeek(i)">
							<text>{{numToStr(i)}}</text>
						</u-col>
					</u-row>
				</view>
			</template>
		</view>
 		<u-gap height="10" bg-color="#fafafa"></u-gap>
 		<view class="base">
 			<u-input
 				class="base-input"
 				v-model="taskObj.address"
 				type="text"
 				placeholder="请输入地点"
 				maxlength="24"
 				:clearable="false"
 				cursor-spacing="10"
 				:custom-style="inputStyle"/>
 			<u-input
 				class="base-input"
 				v-model="taskObj.remarks"
 				type="text"
 				placeholder="请输入备注"
 				maxlength="24"
 				:clearable="false"
 				cursor-spacing="10"
 				:custom-style="inputStyle"/>
 		</view>
		<u-modal v-model="modal" content="是否放弃以更改内容？" :show-cancel-button="true" @confirm="goBack" @cancel="handleCancel"></u-modal>
		
 		<u-picker v-model="startShow"  mode="time" :fill="false" :params="params" @confirm="handleStartTime" @cancel="startShow = false"> </u-picker>
		<u-picker v-model="endShow" mode="time" :fill="false" :params="params" @confirm="handleEndTime" @cancel="startShow = false"></u-picker>
		<!-- 类型 -->
		<u-select v-model="typeShow" :list="typeList" @confirm="typeConfirm"></u-select>
		<!-- 频率、单位、次数 -->
		<u-select v-model="rateShow" :list="rateList" @confirm="rateConfirm"></u-select>
		<u-select v-model="unitShow" :list="unitList" @confirm="unitConfirm"></u-select>
		<u-select v-model="numShow" :list="numList" @confirm="numConfirm"></u-select>
		<u-toast ref="uToast" />
	</view>
 </template>
 
 <script>
	import { mapGetters } from 'vuex'
 	export default {
 		data() {
 			return {
				// 输入框样式
 				inputStyle: {
 					height: '100rpx',
 					borderRadius: '50rpx',
 					marginBottom: '15rpx',
 					paddingLeft: '30rpx',
 					backgroundColor: '#f1f1f1',
 					fontSize: '32rpx'
 				},
				chArr: ['一', '两', '三', '四', '五', '六', '七', '八', '九', '十'],
				// 是否是修改
				edit: false,
 				// 任务
 				taskObj: {
					// 事件标题
 					title: '',
					// 节点任务
					node: false,
					// 节点时间
					nodeTime: {
						title: '请选择',
						content: {}
					},
					// 起始时间
					startTime: {
						title: '请选择',
						content: {}
					},
					// 结束时间
					endTime: {
						title: '请选择',
						content: {}
					},
					// 类型
					mold: {
						title: '请选择',
						type: -1
					},
					// 重复设置
					repeat: {
						// 是否选择
						status: false,
						// 频率
						rate: {
							title: '天',
							type: 0
						},
						// 单位
						unit: {
							title: '一天',
							type: 1
						},
						num: {
							title: '不限次',
							type: 0
						},
						// 所选周次
						week: []
					},
 					// 地址
 					address: '',
 					// 备注
 					remarks: ''
 				},
 				// 时间选择器配置
 				params: {
 					year: false,
 					month: false,
 					day: false,
 					hour: true,
 					minute: true,
 					second: false,
					timestamp: true
 				},
 				startShow: false,
				endShow: false,
				modal: false,
				unitShow: false,
				rateShow: false,
				rateList: [
					{
						value: 0,
						label: '天'
					},
					{
						value: 1,
						label: '周'
					}
				],
				typeShow: false,
				// 0：其他，1：学习，2：工作，3、出行，4：娱乐，5：运动，6：吃饭，7：睡觉
				typeList: [
					{
						value: 0,
						label: '其他'
					},
					{
						value: 1,
						label: '学习'
					},
					{
						value: 2,
						label: '工作'
					},
					{
						value: 3,
						label: '出行'
					},
					{
						value: 4,
						label: '娱乐'
					},
					{
						value: 5,
						label: '运动'
					},
					{
						value: 6,
						label: '吃饭'
					},
					{
						value: 7,
						label: '睡觉'
					}
				],
				numShow: false,
				numList: [
					{
						value: 0,
						label: '不限次'
					}
				]
 			};
 		},
		computed: {
			...mapGetters(['userId']),
			unitList() {
				let arr = []
				let len = 4
				let unit = '周'
				if (this.taskObj.repeat.rate.title === '天') {
					len = 7
					unit = '天'
				}
				for (let i = 0; i < len; i++) {
					arr[i] = ({value: i + 1, label: `${this.chArr[i]}${unit}`})
				}
				return arr
			},
			tipText() {
				let str = this.taskObj.repeat.num.type === 0 ? '' : `,循环${this.taskObj.repeat.num.title}`
				if (this.taskObj.repeat.rate.title === '天') {
					return `任务将会每${this.taskObj.repeat.unit.type > 0 ? this.taskObj.repeat.unit.title : '天'}被添加到当日任务中${str}`
				}
				return `任务将会每${this.taskObj.repeat.unit.type > 0 ? this.taskObj.repeat.unit.title : '周'}${this.taskObj.repeat.week.map(item => {
					return this.numToStr(item)
				}).join('，')}被添加到当日任务中${str}`
			}
		},
 		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack()
			},
			// 前往其他页面
			routeTo(path, params = {}, type = 'navigateTo') {
				// 使用uView的跳转（传参数方便）
				this.$u.route({
					type,
					url: `pages/${path}`,
					params
				});
			},
			// 获取格式化时间字符串
			getDateStr(now) {
				// 判断上下午
				let ante = '上午'
				if (now.hour > 12 && now.minute >= 0) {
					ante = '下午'
				}
				let hour = now.hour.toString().padStart(2, '0')
				let minute = now.minute.toString().padStart(2, '0')
				return `${ante}  ${hour}时${minute}分`
			},
			// 打开时间Picker选择器
			handlePickerShow(i) {
				// 0 startTime
				// 1 endTime
				if (i === 0) {
					this.startShow = true
				} else {
					this.endShow = true
				}
			},
			// 判断前者时间是否小于后者
			judgeTime(a, b){
				if (a.hour < b.hour) {
					return true
				} else if (a.hour === b.hour) {
					if (a.minute < b.minute) {
						return true
					}
				}
				return false
			},
			// 选择开始时间
			handleStartTime(date) {
				if (this.taskObj.node) {
					this.taskObj.nodeTime.content = date
					this.taskObj.nodeTime.title = this.getDateStr(date)
					this.startShow = false
				} else {
					// 判断是否晚于结束时间
					if (JSON.stringify(this.taskObj.endTime.content) === '{}') {
						this.taskObj.startTime.content = date
						this.taskObj.startTime.title = this.getDateStr(date)
						this.startShow = false
					} else {
						if (this.judgeTime(date, this.taskObj.endTime.content)) {
							 this.taskObj.startTime.content = date
							 this.taskObj.startTime.title = this.getDateStr(date)
							 this.startShow = false
						} else {
							this.$refs.uToast.show({title: '所选开始时间应早于结束时间。'})
						}
					}
				}
			},
			// 选择结束时间
			handleEndTime(date) {
				// 判断是否早于开始时间
				if (JSON.stringify(this.taskObj.startTime.content) === '{}') {
						this.taskObj.endTime.content = date
						this.taskObj.endTime.title = this.getDateStr(date)
						this.endShow = false
				} else {
					if (this.judgeTime(this.taskObj.startTime.content, date)) {
						 this.taskObj.endTime.content = date
						 this.taskObj.endTime.title = this.getDateStr(date)
						 this.endShow = false
					} else {
						this.$refs.uToast.show({title: '所选结束时间应晚于开始时间。'})
					}
				}
			},
 			// 取消更改提示
			handleCancel() {
				this.modal = !this.modal
			},
			handleSelect(i){
				switch (i){
					case 0: return this.typeShow = true
					case 1: return this.rateShow = true
					case 2: return this.unitShow = true
					case 3: return this.numShow = true
				}
			},
			hanleWeek(i) {
				let index = this.taskObj.repeat.week.indexOf(i)
				if (index !== -1) {
					this.taskObj.repeat.week.splice(index, 1)
				} else {
					this.taskObj.repeat.week.push(i)
					this.taskObj.repeat.week.sort()
				}
			},
			judgeIn(i) {
				return this.taskObj.repeat.week.includes(i)
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
			rateConfirm(e){
				let el = e[0]
				this.taskObj.repeat.rate.title = el.label
				this.taskObj.repeat.unit.title = el.value ? '一周' : '一天'
				this.taskObj.repeat.rate.type = el.value
			},
			unitConfirm(e){
				let el = e[0]
				this.taskObj.repeat.unit.title = el.label
				this.taskObj.repeat.unit.type =  el.value
			},
			typeConfirm(e) {
				let el = e[0]
				this.taskObj.mold.title = el.label
				this.taskObj.mold.type = el.value
			},
			numConfirm(e) {
				let el = e[0]
				this.taskObj.repeat.num.title = el.label
				this.taskObj.repeat.num.type =  el.value
			},
			// 初始化需编辑任务对象
			initTask(task) {
				this.taskObj.title = task.title
				this.taskObj.address = task.address
				this.taskObj.remarks = task.remarks
				// 节点任务时间
				if (task.node) {
					this.taskObj.node = true
					this.taskObj.nodeTime = {
						title: this.getDateStr(task.startTime),
						content: this.$u.deepClone(task.startTime)
					}
				} else {
					this.taskObj.startTime = {
						title: this.getDateStr(task.startTime),
						content: task.startTime
					}
					this.taskObj.endTime = {
						title: this.getDateStr(task.endTime),
						content: task.endTime
					}
					this.taskObj.mold = {
						title: this.typeList[task.type].label,
						type: task.type
					}
				}
				// 循环设置
				if (task.repeatSet.status) {
					this.taskObj.repeat = {
						status: true,
						rate: {
							title: this.rateList[task.repeatSet.rate].label,
							type: task.repeatSet.rate
						},
						unit: {
							title: `${this.chArr[task.repeatSet.unit - 1]}${task.repeatSet.rate ? '周' : '天'}`,
							type: task.repeatSet.unit
						},
						num: {
							title: this.numList[task.repeatSet.num].label,
							type: task.repeatSet.num
						},
						week: task.repeatSet.week
					}
				}
				if (this.edit) {
					// 由于taskObj本身内部是没有planId
					this.taskObj.planId = task.planId
				}
			},
			// 新增方法
			handleTask(obj) {
				let fnc = this.$apis.createPlan
				let title = '添加成功！'
				
				if (this.edit) {
					fnc = this.$apis.upDataPlan
					obj.planId = this.taskObj.planId
					title = '修改成功！'
				}
				fnc(obj).then(({data}) => {
					if(data.code === 200) {
						if (!this.edit) {
							this.taskObj.planId = data.data.planId
						}
						this.$refs.uToast.show({
							title,
							type: 'success',
							callback: ()=> {
								uni.navigateBack({
									success: () => {
										let page = getCurrentPages().shift();
										if (page == undefined || page == null) return;
										page.$vm.getPlanById(this.taskObj.planId);
									}
								})
							}
						})
					} else {
						this.$refs.uToast.show({ title: data.message})
					}
				}).catch(() => {
					this.$refs.uToast.show({ title: '服务器开小差了！'})
				})
			},
			// 完成创建
			handleConfirm() {
				// 校验标题
				if (this.taskObj.title.length == 0) {
					return this.$refs.uToast.show({ title: '标题为空！', type: 'error'})
				}
				// 保存内容
				let obj = {
					userId: this.userId,
					repeat: true,
					title: this.taskObj.title,
					address: this.taskObj.address,
					remarks: this.taskObj.remarks
				}
				// 判断是否是节点任务
				if (this.taskObj.node) {
					if (JSON.stringify(this.taskObj.nodeTime.content) === '{}') {
						return this.$refs.uToast.show({ title: '未选择执行时间！', type: 'error'})
					} else {
						obj = {
							...obj,
							startTime: this.taskObj.nodeTime.content,
							endTime: this.taskObj.nodeTime.content,
							node: true,
							// 节点任务没有类型
							type: -1
						}
					}
				} else {
					// 非结点任务 判断起始、结束事件、类型是否选择
					if (JSON.stringify(this.taskObj.startTime.content) === '{}' || JSON.stringify(this.taskObj.endTime.content) === '{}') {
						return this.$refs.uToast.show({ title: '未选择开始时间或结束时间！', type: 'error'})
					}
					if (this.taskObj.mold.type === -1) { 
						return this.$refs.uToast.show({ title: '未选择任务类型！', type: 'error'})
					}
					obj = {
						...obj,
						node: false,
						startTime: this.taskObj.startTime.content,
						endTime: this.taskObj.endTime.content,
						type: this.taskObj.mold.type
					}
				}
				
				// 循环
				if (this.taskObj.repeat.status) {
					if (this.taskObj.repeat.rate.type === 1 && !this.taskObj.repeat.week.length) {
						return this.$refs.uToast.show({ title: '以周为周期的循环未选择执行时间！', type: 'error'})
					}
					obj = {
						...obj,
						repeatSet: {
							status: true,
							rate: this.taskObj.repeat.rate.type,
							unit: this.taskObj.repeat.unit.type,
							num: this.taskObj.repeat.num.type,
							week: this.taskObj.repeat.week
						}
					}
				} else {
					// 默认就循环一次
					obj = {
						...obj,
						repeatSet: {
							status: false,
							rate: 0,
							unit: 1,
							num: 1,
							week: []
						}
					}
				}
				
				// 用户ID
				if (!this.userId) {
					return this.$refs.uToast.show({ title: '用户尚未登录！', type: 'error'})
				}
				
				// 调用方法
				this.handleTask(obj)
			}
 		},
 		onLoad(options) {
			for (let i = 0; i < 5; i ++) {
				this.numList.push({value: i + 1,label: `${this.chArr[i]}次`})
			}
			// 传递参数不为空，进行初始化操作
			if (JSON.stringify(options) !== '{}') {
				this.edit = Boolean(Number(options.edit))
				this.initTask(JSON.parse(options.task))
			}
 		}
 	}
 </script>
 
 <style lang="scss" scoped>
	 .wrap {
		 flex: 1;
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
 	.base {
 		padding: 0 30rpx;
 		.base-input {
 			margin: 40rpx 0 50rpx 0;
 		}
 		.base-section {
 			margin-bottom: 80rpx;
 		}
		.base-section-text {
			margin-bottom: 30rpx;
		}
 		.base-section:first-child {
 			margin-top: 80rpx;
 		}
 		::v-deep .u-section__right-info {
 			font-size: 28rpx;
 		}
 	}
	.tip {
		padding: 0 0 30rpx 0;
		color: $u-tips-color;
	}
	.check {
		.tip {padding: 0;}
		padding: 20rpx 0rpx 30rpx;
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
 </style>
 