<template>
  <div
    id="layout-header"
    class="fixed">
    <div class="site-logo">
      <router-link to="/">
        <img src="@/assets/site-logo.svg" alt="" />
        <p class="site-name">Gblog</p>
      </router-link>
    </div>
    <!-- <div class="menus-btn" @click.stop="mobileShow = !mobileShow">Menus</div> -->
    <div
      class="site-menus">
      <el-input type="text" placeholder="根据标题、相关内容查询" v-model="selectcontent"></el-input>
      <div class="menu-item header-search" style="cursor: pointer" @click="selectpost">
          <font-awesome-icon
            :icon="['fas', 'share']"
            size="lg"
            style="cursor: pointer"
            id="like">
          </font-awesome-icon>
      </div>
      <div class="menu-item"><router-link to="/">首页</router-link></div>
      <div class="menu-item" style="min-width:90px;"><router-link to="/message/user">个人信息</router-link></div>
      <div class="menu-item"><a href="#" @click="writeboke">写作</a></div>
      <div class="menu-item hasChild">
        <a href="#">文章</a>
        <div class="childMenu" v-if="technologylist.length">
          <div class="sub-menu" v-for="item in technologylist" :key="item.id">
            <a href="#" @click="technology(item.id)">{{item.technology}}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/header-search";
import request from "../../util/request";
export default {
  name: "layout-header",
  components: { HeaderSearch },
  data() {
    return {
      category: [],
      user: JSON.parse(sessionStorage.getItem("user")) || {},
      technologylist: JSON.parse(sessionStorage.getItem("technology")) || [],
      selectcontent:""
    };
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    writeboke() {
      request.get("/writeboke").then((res) => {
        if (res.code == 0) {
          //路由跳转
          this.$router.push(res.action);
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
          //路由跳转
          this.$router.push(res.action);
        }
      });
    },
    selectpost(){
      console.log();
      //查询文章
      if(this.selectcontent==""){
        this.$message({
          type:"error",
          message:"请输入要查询的内容"
        })
        return;
      }
      request.get("/selectpost?content="+this.selectcontent).then(res=>{
          //进行页面跳转
          if(res.code==0){
            console.log(res.data);
            sessionStorage.setItem("selectpost",JSON.stringify(res.data));  
            if(window.location.pathname=="/selectpost"){
               location.reload();
            }else{
               this.$router.push(res.action);
            }
          }else{
            this.$message({
               type:"error",
               message:res.msg
            })
          }
      })
    },
    technology(id){
       //查看所有文章
       request.get("/selecttechologty?technologyid="+id).then(res=>{
          if(res.code==0){
            sessionStorage.setItem("selecttechologty",JSON.stringify(res.data[0]));  
            sessionStorage.setItem("techologtycount",JSON.stringify(res.data[1]));
            if(window.location.pathname=="/technology"){
               location.reload();
            }else{
               this.$router.push(res.action);
            }
          }else{
            this.$message({
               type:"error",
               message:res.msg
            })
          }
       })
    }
  },
};
</script>

<style scoped lang="less">
#layout-header {
  position: fixed;
  top: 0;
  z-index: 9;
  width: 100%;
  height: 80px;
  padding: 0 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.3s all ease;
  -webkit-transition: 0.3s all ease;
  -moz-transition: 0.3s all linear;
  -o-transition: 0.3s all ease;
  -ms-transition: 0.3s all ease;
  &.hidden {
    top: -100px;
  }
  &.fixed {
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}

.site-logo {
  text-align: center;

  img {
    width: 60px;
    height: 60px;
  }

  p.site-name {
    font-size: 15px;
    font-weight: bold;
    position: relative;
    top: -10px;
  }
}
.menus-btn {
  display: none;
  visibility: hidden;
}
.site-menus {
  display: flex;
  align-items: center;

  .menu-item {
    min-width: 60px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    position: relative;
    a {
      padding: 12px 10px;
      color: #545454;
      font-weight: 500;
      font-size: 16px;
      &:hover {
        color: #ff6d6d;
      }
    }
    &:not(:last-child) {
      margin-right: 15px;
    }
    &.hasChild:hover .childMenu {
      opacity: 1;
      visibility: visible;
      transform: translateY(-5px);
    }
  }
  .childMenu {
    width: 130px;
    background-color: #fdfdfd;
    border-radius: 3px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 55px;
    z-index: 2;
    opacity: 0;
    visibility: hidden;
    transition: 0.7s all ease;
    -webkit-transition: 0.6s all ease;
    -moz-transition: 0.6s all linear;
    -o-transition: 0.6s all ease;
    -ms-transition: 0.6s all ease;
    &:before,
    &:after {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 8px solid white;
      top: -8px;
      left: 20px;
    }
    &:before {
      top: -9px;
      border-bottom: 8px solid #ddd;
    }
    .sub-menu {
      height: 40px;
      line-height: 40px;
      position: relative;
      &:not(:last-child):after {
        /*position: absolute;*/
        content: "";
        width: 50%;
        height: 1px;
        color: #ff6d6d;
        bottom: 0;
        left: 25%;
        z-index: 99;
      }
    }
  }
}
@media (max-width: 960px) {
  #layout-header {
    padding: 0 20px;
  }
}
@media (max-width: 600px) {
  #layout-header {
    padding: 0 10px;
  }
  .menus-btn {
    display: block;
    visibility: visible;
  }
  .site-menus {
    position: absolute;
    display: none;
    visibility: hidden;
    background-color: #f9f9f9;
    width: 100%;
    left: 0;
    top: 80px;
    z-index: -9;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .menu-item {
      position: relative;
      height: unset;
      &:not(:last-child) {
        margin-right: 0;
      }
    }
    .childMenu {
      position: relative;
      width: 100%;
      top: 0;
      background-color: #f3f3f3;
      opacity: 1;
      visibility: visible;
      border: none;
      box-shadow: none;
      &:before,
      &:after {
        content: "";
        position: relative;
        width: 0;
        height: 0;
        border-left: 0;
        border-right: 0;
        border-bottom: 0;
      }
    }
  }
  .site-menus.mobileShow {
    display: inline-block;
    visibility: visible;
    z-index: 99;
  }
}
</style>
