<template>
	<view class="wrap">
		<u-navbar :border-bottom="false"  :title="navTitle" />
		<u-cell-group :border="false">
			<u-cell-item :border-bottom="false" :arrow="false" :title-style="cellStyle" title="头像">
				<view class="avatar-box" solt="right-icon">
					<u-image class="avatar-upload" @click="handleAvatar" width="120rpx" height="120rpx" :src="avatar.url" shape="circle"></u-image>
				</view>
			</u-cell-item>
		</u-cell-group>
		<u-gap height="15" bg-color="#fafafa"></u-gap>
		<view class="wrap-form">
			<u-form :model="info" ref="uForm" label-position="top">
				<u-form-item label="昵称" :required="true" :label-style="cellStyle" prop="name"><u-input v-model="info.name" maxlength="16" placeholder="输入您的昵称" /></u-form-item>
				<u-form-item label="性别" :label-style="cellStyle"><u-input v-model="info.gender.text" placeholder="选择您的性别" type="select"  @click="handleSelect(0)" /></u-form-item>
				<u-form-item label="出生日期" :label-style="cellStyle"><u-input v-model="info.birthday.text" placeholder="选择入您的生日" type="select" @click="handleSelect(1)"/></u-form-item>
				<u-form-item label="个性签名" :label-style="cellStyle"><u-input  v-model="info.bio" placeholder="输入您的个性签名" type="extarea"  maxlength="36"/></u-form-item>
			</u-form>
		</view>
		<view class="wrap-btn">
			<u-button :hairLine="false" type="primary" shape="circle" @click="subInfo">提交信息</u-button>
		</view>
		<u-action-sheet :list="genderList" v-model="actionShow" @click="handleGender"></u-action-sheet>
		<u-picker mode="time" v-model="pickerShow" :params="params" :show-time-tag="false" end-year="2020" @confirm="handleDate"></u-picker>
		<u-toast ref="uToast" />
		<u-popup v-model="loadingShow" mode="center" :mask-close-able="false" width="400rpx" height="300rpx" border-radius="12">
			<view class="loading-box">
				<text>信息上传中，请勿退出</text>
				<u-image width="100%" height="200rpx" :src="loadingSrc"></u-image>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			navTitle: '完善信息',
			loadingShow: false,
			loadingSrc: '/static/img/tips/uploadLoading.gif',
			cellStyle: {
				fontSize: '30rpx',
				fontWeight: 'bold',
				color: '#303133'
			},
			revise: false,
			userId: -1,
			email: '',
			avatar: {
				url: '../../static/img/avatar/default_avatar.jpeg',
				file: null
			},
			info: {
				name: '',
				gender: {
					text: '',
					type: 2
				},
				birthday: {
					text: '',
					date: null
				},
				bio: ''
			},
			actionShow: false,
			pickerShow: false,
			genderList: [
				{
					text: '女',
					type: 0
				},
				{
					text: '男',
					type: 1
				},
				{
					text: '保密',
					type: 2
				}
			],
			rules: {
				name: [
					// 对name字段进行长度验证
					{
						min: 2,
						message: '昵称不能少于2个字',
						trigger: 'change'
					},
					// 对name字段进行必填验证
					{
						required: true,
						message: '请填写昵称',
						trigger: ['change','blur']
					}
				]
			},
			params: {
				year: true,
				month: true,
				day: true,
				hour: false,
				minute: false,
				second: false,
				timestamp: false
			}
		}
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules)
	},
	onLoad(options) {
		this.$nextTick(() => {
			this.email = options.email
			if (options.revise) {
				this.revise = true
				this.userId = Number.parseInt(options.userId)
				this.navTitle = '修改信息'
				this.avatar.url = options.avatar
				this.info.name = options.nickName
				this.info.bio = options.bio
				this.info.gender = this.genderList[Number.parseInt(options.gender)]
				let date = new Date(options.birthday)
				this.info.birthday = {
					text: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
					date
				}
			}
		})
	},
	methods: {
		handleSelect(type) {
			switch (type){
				case 0: return this.actionShow = true
				case 1: return this.pickerShow = true
			}
		},
		handleGender(i){
			this.info.gender = this.genderList[i]
		},
		handleDate(date){
			let {year, month, day}= date
			let text = `${year}/${month}/${day}`
			this.info.birthday = {
				text,
				date: new Date(text)
			}
		},
		handleAvatar() {
			uni.chooseImage({
				count: 1,
				sizeType: ['original'],
				extension: ['png', 'jpg', 'jpeg'],
				sourceType: ['album', 'camera'],
				success: data => {
					if (data.tempFiles[0].size > this.maxSize) {
						this.$refs.uToast.show({
							title: '图片太大了，请重试！',
							type: 'error'
						})
					} else {
						this.avatar = {
							url: data.tempFilePaths[0],
							file: data.tempFiles[0]
						}
					}
				}
			})
		},
		uploadInfo(avatar){
			return new Promise((resolve, reject) => {
				let info = {
					avatar,
					email: this.email,
					nickName: this.info.name,
					gender: this.info.gender.type,
					bio: this.info.bio
				}
				if (this.info.birthday.date) {
					Object.assign(info, {birthday: this.info.birthday.date})
				}
				this.$apis.createUser(info).then(res => {
					let data = res.data
					if (data.code === 200) {
						resolve(data.data.userId)
					}
					reject(data.message)
				}).catch(err => {
					reject(err)
				})
			})
		},
		handleUpData(avatar = this.avatar.url){
			return new Promise((resolve, reject) => {
				let info = {
					userId: this.userId,
					avatar,
					email: this.email,
					nickName: this.info.name,
					gender: this.info.gender.type,
					bio: this.info.bio
				}
				if (this.info.birthday.date) {
					Object.assign(info, {birthday: this.info.birthday.date})
				}
				this.$apis.upDataUserInfo(info).then(res => {
					let data = res.data
					if (data.code === 200) {
						resolve(data.data)
					}
					reject(data.message)
				}).catch(err => {
					reject(err)
				})
			})
		},
		subInfo(){
			this.$refs.uForm.validate(valid => {
				if (valid) {
					if (this.revise) {
						if (this.avatar.file) {
							this.loadingShow = true
							this.$apis.uploadAvatar({
								name: 'avatar',
								filePath: this.avatar.url,
								fileType:'image'
							}).then(async res => {
								let data = JSON.parse(res.data)
								if (data.code === 200) {
									await this.handleUpData(data.data.url);
									this.$refs.uToast.show({
										title: '信息修改成功！',
										type: 'success'
									})
									uni.switchTab({
										url: '/pages/mine/index',
										success: (res) => {
											let page = getCurrentPages().pop();
											if (page == undefined || page == null) return;
											page.$vm.getUserInfo()
										}
									})
								} else {
									this.$refs.uToast.show({title: '图片上传失败，请重试。'})
								}
							}).catch((err) => {
								this.$refs.uToast.show({title: '信息更新失败，请重试。'})
							}).finally(() => {
								this.loadingShow = false
							})
						} else {
							this.handleUpData().then(res => {
								this.$refs.uToast.show({
									title: '信息修改成功！',
									type: 'success'
								})
								uni.switchTab({
									url: '/pages/mine/index',
									success: (res) => {
										let page = getCurrentPages().pop();
										if (page == undefined || page == null) return;
										page.$vm.getUserInfo()
									}
								})
							}).catch((err) => {
								this.$refs.uToast.show({title: '信息更新失败，请重试。'})
							})
						}
					} else {
						if (this.avatar.file) {
							this.loadingShow = true
							this.$apis.uploadAvatar({
								name: 'avatar',
								filePath: this.avatar.url,
								fileType:'image'
							}).then(async res => {
								let data = JSON.parse(res.data)
								if (data.code === 200) {
									let userId = await this.uploadInfo(data.data.url)
									uni.setStorageSync('userId', userId)
									this.$refs.uToast.show({
										title: '信息录入成功！',
										type: 'success',
										callback: ()=> {
											setTimeout(() => {
												uni.reLaunch({
													url: `/pages/mine/index`
												})
											}, 200)
										}
									})
								} else {
									this.$refs.uToast.show({title: '图片上传失败，请重试。'})
								}
							}).catch((err) => {
								this.$refs.uToast.show({title: '信息上传失败，请重试。'})
							}).finally(() => {
								this.loadingShow = false
							})
						} else {
							this.$refs.uToast.show({title: '头像未上传！'})
						}
					}
				}
			})
		}
	}
};
</script>

<style lang="scss" scoped>
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
.avatar-box {
	width: 100%;
	display: flex;
	justify-content: flex-end;
	.avatar-upload {
		width: 120rpx;
		height: 120rpx;
		box-sizing: border-box;
		border: 1rpx solid #fafafa;
	}
}
.name-box {
	padding-left: 20rpx;
}
.loading-box {
	text-align: center;
	padding: 30rpx 40rpx;
}
</style>
