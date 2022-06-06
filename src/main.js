import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/style.less'
import './assets/font/iconfont.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
require('./Mock')
import { parseTime } from './utils'
import { formatDate } from './util/index'
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css' //样式
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'

library.add(
    fas, far, fab
);


Vue.directive('highlight', function(el) {
    let blocks = el.querySelectorAll('pre code');
    blocks.forEach((block) => {
        hljs.highlightBlock(block)
    })
})

Vue.config.productionTip = false
Vue.filter('parseTime', (v) => parseTime(v, '{y}-{m}-{d}'))
Vue.filter('formatDate', (v) => formatDate(v))
Vue.use(ElementUI)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)
    //拦截路径访问用户是否登录
if (window.location.pathname === "/Writeboke" ||
    window.location.pathname === "/uploadfile" ||
    window.location.pathname === "/user" ||
    window.location.pathname === "/message") {
    let user = JSON.parse(sessionStorage.getItem("user"))
    console.log(user);
    if (user == null) {
        //路由到登录页面
        router.push("/login")
    }
}
//拦截路由跳转用户是否登录
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) { //判断是否添加路由拦截判断
        if (sessionStorage.getItem("user") != null) { //获取session数据
            next();
        } else {
            next({
                path: "/login",
                query: { redirect: to.fullPath }
            });
        }
    } else {
        next();
    }
})

new Vue({
    router,
    store,
    data: function() {
        return {
            //全局变量
            bscomid: ""
        }
    },
    render: h => h(App),
    beforeCreate() {
        Vue.prototype.$bus = this;
    }
}).$mount('#app')