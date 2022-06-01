<template>
	<view class="wrap">
		<u-navbar :background="{ backgroundColor: '#ffffff' }" title-color="#303133" title-size="30" :border-bottom="false" title="历史上的今天"></u-navbar>
		<u-gap height="10" bg-color="#fafafa"></u-gap>
		<view class="content">
			<u-time-line>
				<u-time-line-item v-for="(item, i) in list">
					<template v-slot:content>
						<view>
							<view class="line-title">{{item.title}}</view>
							<view class="line-date">{{fomatDate(item.date)}}</view>
						</view>
					</template>
				</u-time-line-item>
			</u-time-line>
		</view>
		<u-toast ref="uToast"/>
	</view>
</template>

<script>
export default {
	data() {
		return {
			date: '',
			list: []
		}
	},
	methods: {
		getTodayAllHistory() {
			this.$apis.getTodayAllHistory({
				date: this.date
			}).then(({data}) => {
				if (data.code === 200) {
					this.list = data.data.reverse()
				} else {
					this.$refs.uToast.show({title: data.message})
				}
			}).catch(() => {
				this.$refs.uToast.show({title: '服务器开小差了'})
			})
		},
		fomatDate(date) {
			if (date[0] === '-') {
                date = `公元前${Array.from(list.date).slice(1).join('')}`
            }
            return date
		}
	},
	onLoad(option) {
		this.date = option.date
		this.getTodayAllHistory()
	}
};
</script>

<style lang="scss" scoped>
.wrap {
	height: 100vh;
	background-color: #fff;
	position: relative;
	.content {
		padding: 30rpx 30rpx 30rpx 50rpx;
		.line-title {
			color: #303133;
			margin-bottom: 16rpx;
			font-size: 30rpx;
		}
		.line-date {
			color: #909399;
			font-size: 26rpx;
		}
	}
}
</style>
