import axios from 'axios'
import router from "../router";

const request = axios.create({
    baseURL: '/api', // 注意！！ 这里是全局统一加上了 '/api' 前缀，也就是说所有接口都会加上'/api'前缀在，页面里面写接口的时候就不要加 '/api'了，否则会出现2个'/api'，类似 '/api/api/user'这样的报错，切记！！！
    timeout: 5000
})

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {
    console.log(config.url)
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    let user = JSON.parse(sessionStorage.getItem("user"));
    //判断该请求是否要先进行登录验证 
    if (config.url === "/writeboke" || config.url === "/uploadfile" ||
        config.url === "/saveboke" || config.url === "/addlike" ||
        config.url == "/addcollect" || config.url === "/tocomments" ||
        config.url === "/replycomments" || config.url === "/uploadUser" || config.url === "/upload" ||
        config.url === "/getmypost" || config.url === "/getmyCollect" || config.url === "/getmyMessage" ||
        config.url === "/selectlikeauthor" || config.url === "/closeauthor" || config.url === "/selectfocusmy" ||
        config.url === "/selectmyfocus") {
        //获取用户信息
        if (!user) {
            //没有路由到登录
            router.push("/login")
            return;
        }
        //对于一些要判断的则将token 拼接到请求头中，给后台进行判断
        config.headers['token'] = user.token; // 设置请求头 token
    }
    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        let res = response.data;
        // 如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res
        }
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)

export default request