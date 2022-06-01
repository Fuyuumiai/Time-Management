<template>
	<view class="warp">
		<u-navbar  title="未登录" :background="{ backgroundColor: '#fff' }" :is-back="false" :border-bottom="false"></u-navbar>
		<view class="null-box">
			<u-empty text="登录解锁更多内容~" margin-top="200" icon-size ="400" src="../../static/img/null/login-null.png"></u-empty>
			<u-button :hairLine="false" shape="circle" type="primary" @click="routeTo('entrance/login')">登录</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods: {
			routeTo(path, params = {}, type = 'navigateTo') {
				// 使用uView的跳转（传参数方便）
				this.$u.route({
					type,
					url: `pages/${path}`,
					params
				});
			}
		}
	}
</script>

<style lang="scss" >
	.warp {
		width: 100%;
		height: 100vh;
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
</style>
