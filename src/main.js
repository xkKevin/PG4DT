import Vue from 'vue'
import App from './App.vue'
import router from './router'
// https://element.eleme.cn/#/zh-CN
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')