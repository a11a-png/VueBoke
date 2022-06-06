<template>
  <div class="login">
    <div class="site-content">
      <section-title>
        <div class="login-header">
          <div class="title">登录</div>
          <div class="apply">
            <router-link to="/createUser">注册</router-link>
          </div>
        </div>
      </section-title>
      <div class="login-conter">
        <!-- formdata为数据 rules指定义规则-->
        <form action="" :model="formdata">
            <div>
                 <span>账号：</span>
                 <input type="text" v-model="formdata.userName" placeholder="请输入账号">
            </div>
            <div>
                 <span>密码：</span>
                 <input type="text" v-model="formdata.userPassword" placeholder="请输入密码">
            </div>
            <div>
                 <span>验证码：</span>
                 <input type="text" v-model="formdata.yzm" placeholder="请输入验证码">
                 <img :src='imgCode' @click="yzmimg" id="img">
            </div>
             <button @click="DLlogin" type="button">登录</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import sectionTitle from "@/components/section-title";
import request from "../util/request";
export default {
  name: "login",
  data() {
    return {
      formdata: {},
      imgCode:'/api/getYzm?time='+new Date().getTime()
    };
  },
  components: {
    sectionTitle,
  },
  created(){
    
  },
  methods:{
      yzmimg(){
         var sc=document.getElementById("img")
         sc.setAttribute('src','/api/getYzm?time='+new Date().getTime()) 
      },
      DLlogin(){
       if(this.formdata.userName==null || this.formdata.userName==""){
          this.$message({
             type:"error",
             message:"请填写账号"
          })
          return;
       }
       if(this.formdata.userPassword==null || this.formdata.userPassword==""){
          this.$message({
             type:"error",
             message:"请填写密码"
          })
          return;
       }
       if(this.formdata.yzm==null || this.formdata.yzm==""){
          this.$message({
             type:"error",
             message:"请填写验证码"
          })
          return;
       }
       request.post('/DLlogin',this.formdata).then(res=>{
           if (res.code==0){
             console.log(res);
              this.$message({
                type:"success",
                message:"登录成功"
              })
              //保存用户 stringify转换成Json格式
              sessionStorage.setItem("user",JSON.stringify(res.data[0]))
              sessionStorage.setItem("sort",JSON.stringify(res.data[1]))
              sessionStorage.setItem("technology",JSON.stringify(res.data[2]))
              //路由跳转
              this.$router.push(res.action) 
            }else {
              this.$message({
                type:"error",
                message:res.msg
              })
            }
         })
    }
  }
};
</script>

<style scoped lang="less">
.login {
  padding-top: 40px;
}
.login-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 80px;
  font-weight: 400;
  .title {
    font-size: 20px;
  }
  .apply:hover {
    color: #ff6d6d;
  }
}
.login-conter{
    width: 80%;
    margin: 100px auto;
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 15px;
}
.login-conter div{
    margin: 15px 0;
}
.login-conter input{
    border-radius: 10px;
    border: 1px solid #ccc;
    line-height: 30px;
    padding-left: 10px;
    width: 250px;
}
#img{
   position: relative;
   top: 14px;
   left: 5px;
}
</style>