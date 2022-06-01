import Vue from 'vue'
import App from './App'
// 引入 Vuex
import store from './store/index'
// 引入uView
import uView from 'components/uview-ui'
// 引入apis
import apis from 'requests/index.js'

Vue.config.productionTip = false

// 挂载请求接口
Vue.prototype.$apis = apis

App.mpType = 'app'

// 使用uView
Vue.use(uView)

const app = new Vue({
    ...App,
	store
})
app.$mount()
