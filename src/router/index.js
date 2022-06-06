import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import login from '../views/login'
import createUser from '../views/createUser'
import Writeboke from '../views/Writeboke'
import user from '../components/mess/User'
import message from '../views/message'
import mypost from '../components/mess/mypost'
import collect from '../components/mess/collect'
import mymess from '../components/mess/mymess'
import selectpost from '../views/selectpost'
import technology from '../views/technology'
import myfocus from '../components/mess/myfocus'
import focusmy from '../components/mess/focusmy'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: () =>
            import ('../views/Home.vue'),
        meta: { title: '首页' }
    },
    {
        path: '/category/:cate',
        name: 'category',
        component: () =>
            import ('../views/Home.vue'),
        meta: { title: '分类', params: 'cate' }
    },
    {
        path: '/search/:words',
        name: 'search',
        component: () =>
            import ('../views/Home.vue'),
        meta: { title: '搜索', params: 'words' }
    },
    {
        path: '/about',
        name: 'about',
        component: () =>
            import ('../views/About.vue'),
        meta: { title: '关于' }
    },
    {
        path: '/friend',
        name: 'friend',
        component: () =>
            import ('../views/Friend.vue'),
        meta: { title: '友链' }
    },
    {
        path: '/article',
        name: 'article',
        component: () =>
            import ('../views/Articles.vue'),
        meta: { title: '文章' }
    },
    {
        path: '/login',
        name: 'login',
        component: login,
        meta: { title: '登录' }
    },
    {
        path: '/createUser',
        name: 'createUser',
        component: createUser,
        meta: { title: '注册' }
    },
    {
        path: '/Writeboke',
        name: 'Writeboke',
        component: Writeboke,
        meta: { title: '发表文章' }
    },
    // {
    //     path: '/user',
    //     name: 'user',
    //     component: user,
    //     meta: {
    //         title: '个人信息',
    //         requireAuth: true // 配置此条，进入页面前判断是否需要登陆
    //     }
    // },
    {
        path: '/message',
        name: 'message',
        component: message,
        meta: {
            title: '消息中心',
            requireAuth: true // 配置此条，进入页面前判断是否需要登陆
        },
        children: [{
                path: 'mypost',
                name: 'mypost',
                component: mypost,
            },
            {
                path: 'user',
                name: 'user',
                component: user,
            },
            {
                path: 'collect',
                name: 'collect',
                component: collect,
            },
            {
                path: 'mymess',
                name: 'mymess',
                component: mymess,
            },
            {
                path: 'focusmy',
                name: 'focusmy',
                component: focusmy,
            },
            {
                path: 'myfocus',
                name: 'myfocus',
                component: myfocus,
            }
        ]
    },
    {
        path: '/selectpost',
        name: 'selectpost',
        component: selectpost,
    },
    {
        path: '/technology',
        name: 'technology',
        component: technology,
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
router.beforeEach((to, from, next) => {
    let title = 'Gblog'
    if (to.meta.params) {
        title = `${to.meta.title}:${to.params[to.meta.params] || ''} - ${title}`
    } else {
        title = `${to.meta.title} - ${title}`
    }
    document.title = title
    if (to.path !== from.path) {
        store.dispatch('setLoading', true);
    }
    next();
})
router.afterEach((to, from) => {
    // 最多延迟 关闭 loading
    setTimeout(() => {
        store.dispatch('setLoading', false);
    }, 1500)
})
export default router