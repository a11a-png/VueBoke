module.exports = {
    devServer: {
        port: 8888,
        proxy: { //设置代理
            '/api/': { //自定义名
                target: 'http://localhost:8801', //目标地址
                changeOrigin: true, //是否设置同源，输入是的
                pathRewrite: { //路径重写
                    '^/api/': '' //选择忽略拦截器里面的单词, 否者会解析/api路径
                }
            }
        }
    },
    lintOnSave: false
}