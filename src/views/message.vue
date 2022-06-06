<template>
  <div class="message">
    <banner :isHome="true"></banner>
    <div style="width:1200px; margin:0 auto;">
     <div class="message-container">
         <el-row :gutter="20">
            <el-col :span="5" style="height:100vh; border-right:1px solid #ccc; padding-right:0px;">
              <ul>
                <li><router-link to="/message/user" class="list-group-item" active-class="active">个人信息</router-link></li>
                <li><router-link to="/message/mypost" class="list-group-item" active-class="active">我的文章</router-link></li>
                <li><router-link to="/message/collect" class="list-group-item" active-class="active">我的收藏</router-link></li>
                <li><router-link to="/message/mymess" class="list-group-item" active-class="active">我的消息</router-link></li>
                <li><router-link to="/message/focusmy" class="list-group-item" active-class="active">關注我的用戶</router-link></li>
                <li><router-link to="/message/myfocus" class="list-group-item" active-class="active">我關注的作者</router-link></li>
              </ul>
            </el-col>
            <el-col :span="19">
               <router-view></router-view>
            </el-col>
         </el-row>
     </div>
    </div>
  </div>
</template>

<script>
import sectionTitle from "@/components/section-title";
import banner from "@/components/banner";

export default {
  name: "message",
  data() {
    return {
      users: JSON.parse(sessionStorage.getItem("user")) || {},
    };
  },
  components: {
    sectionTitle,
    banner,
  },
};
</script>

<style scoped lang="less">
.message {
  padding-top: 40px;
}
.message-header {
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
.message-container {
  width: 80%;
  margin: 100px auto;
  border: 1px solid #ccc;
  border-radius: 15px;
}
.message-container li{
  text-align: right;
  line-height: 30px;
}
.message-container li a{
  border: none !important;
}
.message-conter div {
  margin: 15px 0;
}
.message-conter input {
  border-radius: 10px;
  border: 1px solid #ccc;
  line-height: 30px;
  padding-left: 10px;
  width: 250px;
}
#img {
  position: relative;
  top: 14px;
  left: 5px;
}
</style>
