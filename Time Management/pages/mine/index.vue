<template>
	<view class="u-skeleton">
		<view class="wrap" :style="{backgroundColor: backColor}">
			<view class="wrap-top" :style="{backgroundImage: `url(${info.avatar})`}">
				<view class="mask"></view>
			</view>
			<view class="wrap-box">
				<view class="profily">
					<view class="base">
						<view class="avatar u-skeleton-fillet" :style="{backgroundImage: `url(${info.avatar})`}"></view>
						<view class="info">
							<view class="name">
								<text>{{info.nickName}}</text>
							</view>
							<view class="tip">
								<text>{{info.bio}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="content">
				<view class="card">
					<view class="title">
						<u-section line-color="#2979ff" title="进行中" :right="false"></u-section>
					</view>
					<view class="num u-skeleton-fillet">
						<view class="item" v-for="(data, i) in list" :key="i">
							<view class="figure">
								<u-count-to font-size="42" :start-val="data.start" :end-val="record[i]"></u-count-to>
							</view>
							<view class="text">
								<text>{{data.name}}</text>
							</view>
						</view>
					</view>
				</view>
				
				<u-cell-group :border="false">
					<u-cell-item class="u-skeleton-rect" icon="calendar" title="历史总结" @click="routeTo('summary/index')"></u-cell-item>
					<u-cell-item class="u-skeleton-rect" icon="edit-pen" title="修改信息" @click="routeTo('entrance/info', info)"></u-cell-item>
					<u-cell-item  icon="kefu-ermai" title="问题反馈" @click="routeTo('mine/feedback')"></u-cell-item>
				</u-cell-group>
				<u-button :hairLine="false" style="margin-top: 35rpx; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)" @click="hadleLogout">退出登录</u-button>
			</view>
		</view>
		<u-toast ref="uToast" />
		<u-skeleton :loading="loadingShow" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
 </template>
 
 <script>
	 import { mapGetters } from 'vuex'
 	export default {
 		data() {
 			return {
				// 用户基本信息
				info: {
					nickName: '',
					bio: '',
					avatar: ''
				},
				status: {
					type: false
				},
				record: [0, 0],
 				list: [
					{
 						name: '任务',
						start: 0
 					},
 					{
						name: '目标',
						start: 0
 					}
				],
				loadingShow: false
 			};
 		},
 		methods: {
			// 前往其他页面
			routeTo(path, params = {}, type = 'navigateTo') {
				// 使用uView的跳转（传参数方便）
				this.$u.route({
					type,
					url: `pages/${path}`,
					params
				});
			},
			hadleLogout(){
				uni.removeStorage({
				    key: 'userId',
				    success: () => {
				       this.$refs.uToast.show({
				       	title: '退出成功，感谢您的使用！',
				       	callback: ()=> {
				       		this.routeTo('mine/nologin')
				       	}
				      })
				    }
				});
			},
			getUserInfo(userId = this.userId){
				this.status.type = true
				this.loadingShow = true
				this.$apis.getUserInfo({userId}).then(res => {
					let data = res.data
					if (data.code === 200) {
						let {nickName, avatar, bio, gender, birthday, email} = data.data
						this.info = {
							userId,
							email,
							nickName,
							bio,
							avatar: avatar.indexOf('http') === -1 ? `${this.$apis.baseUrl}/${avatar}` : avatar,
							gender,
							birthday: new Date(new Date(birthday).getTime() + 8 * 3600 * 1000),
							revise: true
						}
					}
				}).catch(err => {
					this.$refs.uToast.show({title: '用户信息获取失败'})
				}).finally(() => {
					this.loadingShow = false
				})
			},
			getRecordInfo(userId = this.userId) {
				this.$apis.getRecordInfo({userId}).then(({data}) => {
					if (data.code === 200) {
						this.record = data.data.record
					}
				}).catch(err => {
					this.$refs.uToast.show({title: '用户信息获取失败'})
				})
			}
 		},
		onShow() {
			this.getRecordInfo()
		},
		onLoad(option){
			let userId = uni.getStorageSync('userId')
			this.getUserInfo(userId)
			this.getRecordInfo(userId)
		},
		computed: {
			backColor() {
				if (this.status) {
					return '#FAFAFA'
				} else {
					return '#F5F5F5'
				}
			},
			...mapGetters(['userId'])
		},
 	}
 </script>
 
 <style lang="scss" scoped>
 	.wrap{
 		height: 100vh;
 		&-top {
 			height: 18%;
			background-repeat: no-repeat;
			background-position: 0% 50%;
 			background-size: cover;
 			.mask {
 				background: rgba(0, 0, 0, .4);
 				height: 100%;
 			}
 		}
 		&-box {
 			background: #F9F9F9;
 			position: relative;
 			.profily {
 				position: absolute;
 				width: 90%;
 				margin: 0 auto;
 				top: -100upx;
 				left: 5%;
 				background: #FEFEFE;
 				padding: 30rpx;
				border-radius: 16rpx;
 				box-sizing: border-box;
 				box-shadow: 0px 2px 5px #EDEDED;
 			}
 		}		
 	}
 
 	.base {
 		display: flex;
 		align-items: center;
 		position: relative;
 		.avatar {
 			height: 120rpx;
 			width: 120rpx;
 			background-size: 100%;
			border-radius: 16rpx;
			background-repeat: no-repeat;
			background-size: cover;
 		}
		.info {
			height: 120rpx;
			margin-left: 20rpx;
			display: flex;
			flex-direction: column;
			.name {
				flex: 2;
				font-size: 34rpx;
				color: $u-main-color;
			}
			.tip {
				flex: 1;
				display: flex;
				font-size: 26rpx;
				color: $u-tips-color;
				flex-direction: column;
				justify-content: flex-end;
			}
		}
		.setting {
			position: absolute;
			top: 0;
			right: 0;
		}
 	}
 .content {
	 margin-top: 100rpx;
	 padding: 0 35rpx;
	 .title {
		 padding: 30rpx;
	 }
	 .card {
		 margin-bottom: 20rpx;
		 background-color: #FFFFFF;
		 border-radius: 16rpx;
		 box-shadow: 0px 2px 5px #EDEDED;
		 .num {
			 display: flex;
			 align-items: center;
			 .item {
				 flex: 1;
				 display: flex;
				 flex-direction: column;
				 text-align: center;
				 padding:0 30rpx 30rpx 30rpx;
				 .text {
					 color: $u-tips-color;
					 font-size: 26rpx;
					 margin-top: 5rpx;
				 }
			 }
			 
		 }
	 }
	 ::v-deep .u-cell-item-box {
		border-radius: 16rpx;
		box-shadow: 0px 2px 5px #EDEDED;
	 }
 }
.null-box {
	position: absolute;
	width: 35%;
	margin-left: 32.5%;
	height: 450rpx;
}
::v-deep .u-btn--default {
	color: #606266;
	border-color: #c0c4cc;
	background-color: #ffffff;
	box-shadow: 3px 3px 4px rgba(0, 102, 204, 0.2);
	
}
::v-deep .u-btn--bold-border {
	border: 0px solid #ffffff;
}
::v-deep .u-size-default {
	height: 80rpx;
	line-height: 80rpx;
}
.loading-box {
	text-align: center;
	padding: 30rpx 40rpx;
}
</style>
 