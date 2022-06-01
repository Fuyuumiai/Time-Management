<template>
	<view class="wrap">
		<!-- 导航栏 -->
		<u-navbar :background="{ backgroundColor: '#ffffff' }"  :is-back="false" :border-bottom="false">
			<view class="slot-wrap">
				<view class="navbar-left"><u-icon class="left-icon" name="../../static/btnIcon/0.png" size="40" color="#909399" @click="routeTo('task/calendar')"/></view>
				<view class="navbar-text"><text>任务管理</text></view>
				<view class="navbar-right"><u-icon class="right-icon" name="../../static/btnIcon/3.png" size="40" color="#909399" @click="routeTo('task/handleTask')" /></view>
			</view>
		</u-navbar>
		<view class="tab-wrap">
			<u-tabs-swiper ref="uTabs" :list="tabLists"  :current="current" @change="tabsChange" :is-scroll="false" :bold="false" bar-width="50" bar-height="8"></u-tabs-swiper>
		</view>
		<swiper class="swiper-box" :class="[execuArray.length ? 'conent-bg' : 'null-bg']" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="getVarietyPlan(execuQuery, true, execuArray)">
					<task-manage :taskArray="execuArray" v-if="execuArray.length" @detachPlan="detachPlan"></task-manage>
					<view class="null-box" v-else>
						<u-gap height="10" bg-color="#fafafa"></u-gap>
						<u-empty text="这里空空如也~" mode="favor" margin-top="150" icon-size="300" src="../../static/img/null/list-null.png"></u-empty>
						<view class="null-btn">
							<u-button :hairLine="false" shape="circle" type="primary" @click="routeTo('task/handleTask')">添加任务</u-button>
						</view>
					</view>
					<u-loadmore v-if="execuArray.length" :status="execuQuery.status" margin-top="50" :loadText="loadText" />
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height: 100%;width: 100%; position: relative;" @scrolltolower="getVarietyPlan(overQuery, true, overArray)">
					<task-manage :taskArray="overArray" v-if="overArray.length"></task-manage>
					<view class="null-box" v-else>
						<u-gap height="10" bg-color="#fafafa"></u-gap>
						<u-empty text="这里空空如也~" mode="favor" margin-top="150" icon-size="300" src="../../static/img/null/list-null.png"></u-empty>
					</view>
					<u-loadmore v-if="overArray.length" :status="overQuery.status" margin-top="50" :loadText="loadText" />
				</scroll-view>
			</swiper-item>
		</swiper>
		<u-toast ref="uToast" />
		<u-no-network></u-no-network>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import taskManage from '@/components/task-card/manage.vue'
export default {
	data() {
		return {
			cardStyle: {
				padding: '0 20rpx',
				marginTop: '20rpx',
				position: 'relative'
			},
			// tabs设置
			current: 0,
			swiperCurrent: 0,
			tabLists: [{name: '进行中'},{name: '已过期'}],
			// 未过期任务
			execuArray: [],
			// 未过期任务查询条件
			// 当前页数、一页获取数量、是否还有下一页
			loadText: {
				loadmore: '上拉加载更多',
				loading: '努力加载中',
				nomore: '暂无更多内容'
			},
			execuQuery: {
				page: 1,
				num: 5,
				next: true,
				status: 'loadmore'
			},
			// 已过期任务
			overArray: [],
			overQuery: {
				page: 1,
				num: 5,
				next: true,
				status: 'loadmore'
			}
		};
	},
	computed: {
		...mapGetters(['userId'])
	},
	components: {
		taskManage
	},
	onLoad() {
		this.getPlan(0)
		this.getPlan(1)
	},
	methods: {
		// 前往其他页面
		routeTo(path, params = {}, type = 'navigateTo') {
			this.$u.route({
				type,
				url: `pages/${path}`,
				params
			});
		},
		// 以下三个为tabs切换关联的函数
		tabsChange(index) {
			this.swiperCurrent = index;
		},
		transition(e) {
			let dx = e.detail.dx;
			this.$refs.uTabs.setDx(dx);
		},
		animationfinish(e) {
			let current = e.detail.current;
			this.$refs.uTabs.setFinishCurrent(current);
			this.swiperCurrent = current;
			this.current = current;
		},
		// 根据条件来查询
		getVarietyPlan(query, repeat, taskArray) {
			if (!query.next) {
				return false
			}
			query.status = 'loading'
			
			this.$apis.getVarietyPlan({
				userId: this.userId,
				repeat,
				page: query.page,
				num: query.num
			}).then(res => {
				let data = res.data
				if (data.code === 200) {
					query.page = data.data.page
					query.next = data.data.next
					if (query.next) {
						query.status = 'loadmore'
					} else {
						query.status = 'nomore'
					}
					taskArray.push(...data.data.date)
				}
			}).catch(err => {
				this.$refs.uToast.show({
					title: '服务器开小差了o(╥﹏╥)o',
					type: 'error'
				})
			})
		},
		// 移除方法
		detachPlan(planId) {
			let i = this.fundById(this.execuArray, planId)
			this.execuArray.splice(i, 1)
			this.getPlanById(planId, this.overArray)
		},
		// 初始化函数
		getPlan(type = 0) {
			if (type) {
				// 过期任务
				this.getVarietyPlan(this.overQuery, false, this.overArray)
			} else {
				// 未过期任务
				this.getVarietyPlan(this.execuQuery, true, this.execuArray)
			}
		},
		
		
		// 判断指定id的对象在对象数组中的位置
		fundById(arr, id) {
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].planId === id) {
					return i
				}
			}
			return -1
		},
		// 根据id获取任务
		getPlanById(planId, arr = this.execuArray) {
			this.$apis.getPlanById({
				userId: this.userId,
				planId
			}).then(({data}) => {
				if (data.code === 200) {
					let date = data.data
					let i = this.fundById(arr, planId)
					if (i !== -1) {
						this.$set(arr, i, date)
					} else {
						arr.unshift(date)
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

<style scoped lang="scss">
.wrap {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #fafafa;
	position: relative;
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
	color: #303133;
	font-size: 30rpx;
}
.navbar-right {
	justify-content: flex-end;
	.right-icon {
		padding-right: 40rpx;
	}
}

.tab-wrap {
	border-bottom: 1rpx solid #fafafa;
}
// 配合实现swiper组件内滚动,精髓在于wrap的flex-direction: column;
.swiper-box {
	flex: 1;
}
.conent-bg {
	background-color: #fafafa;
}
.null-bg {
	background-color: #FFFFFF;
}
.swiper-item {
	height: 100%;
}
.null-box {
	position: absolute;
	width: 100%;
	height: 400rpx;
	.null-btn {
		width: 60%;
		margin-left: 20%;
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
::v-deep .u-btn--primary {
	background-color: #409EFF;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
