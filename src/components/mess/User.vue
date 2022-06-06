<template>
  <div class="user">
    <div class="user-conter">
      <section-title>
        <div class="user-header">
          <div class="title">个人信息</div>
          <div class="apply">
            <a href="#" @click="editorfun">编辑</a>
          </div>
        </div>
      </section-title>
      <!-- 上传文件  -->
      <el-upload
        class="avatar-uploader"
        action="none"
        :show-file-list="false"
        :on-change="changefile"
        :auto-upload="false"
      >
        <img
          v-if="this.imgUrl != null"
          :src="this.imgUrl"
          style="border-radius: 10px; cursor: pointer"
        />
        <img
          v-else-if="this.users.userPhoto != null"
          :src="this.users.userPhoto"
          style="border-radius: 10px; cursor: pointer"
        />
        <img
          v-else
          src="../../../public/default.png"
          style="border-radius: 10px; cursor: pointer"
        />
      </el-upload>
      <el-form :model="users">
        <el-form-item>
          <span>账号：</span>
          <input
            type="text"
            v-if="this.editor"
            :placeholder="this.users.userName"
            v-model="users.userName"
          />
          <input type="text" v-else v-model="this.users.userName" disabled />
        </el-form-item>
        <el-form-item>
          <span>圆龄：</span>
          <input
            type="text"
            v-if="this.editor"
            :placeholder="this.users.userAge"
            v-model="users.userAge"
          />
          <input type="text" v-else v-model="this.users.userAge" disabled />
        </el-form-item>
        <el-form-item>
          <span>生日：</span>
          <el-date-picker
            type="date"
            v-model="users.userBirthday"
          />
          <!-- <el-date-picker type="date" v-else v-model="users.userBirthday" disabledDate /> -->
        </el-form-item>
        <el-form-item>
          <span>手机号：</span>
          <input
            type="text"
            v-if="this.editor"
            :placeholder="this.users.userPhone"
            v-model="users.userPhone"
          />
          <input type="text" v-else v-model="this.users.userPhone" disabled />
        </el-form-item>
        <el-form-item>
          <span>邮箱：</span>
          <input
            type="text"
            v-if="this.editor"
            :placeholder="this.users.userEmail"
            v-model="users.userEmail"
          />
          <input type="text" v-else v-model="this.users.userEmail" disabled />
        </el-form-item>
        <el-button type="primary" @click="upload">确认修改</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import sectionTitle from "@/components/section-title";
import banner from "@/components/banner";
import request from "../../util/request";
export default {
  name: "user",
  data() {
    return {
      users: JSON.parse(sessionStorage.getItem("user")) || {},
      editor: false, //是否编辑
      imgUrl: null, //图片渲染
      imgFile: null, //图片文件
    };
  },
  props: {},
  components: {
    sectionTitle,
    banner,
  },
  methods: {
    editorfun() {
      this.editor = true;
    },
    upload() {
      if (this.editor) {
        var Formdata = new FormData();
        if(this.imgFile!=null){
           Formdata.append("file", this.imgFile.raw);
        }
        Formdata.append("userid", this.users.userid);
        request.post("/uploadUser", Formdata).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: res.msg,
            });
            request.post("/upload", this.users).then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: "success",
                  message: res.msg,
                });
                //更新数据
                sessionStorage.setItem("user", JSON.stringify(res.data));
                //路由跳转
                location.reload();
              } else {
                this.$message({
                  type: "error",
                  message: res.msg,
                });
              }
            });
          } else {
            this.$message({
              type: "error",
              message: res.msg,
            });
          }
        }
        );
      }else{
        this.$message({
              type: "error",
              message: "请点击编辑按钮",
            });
          }
    },
      changefile(file, fileList) {
      this.imgUrl = URL.createObjectURL(file.raw);
      this.imgFile = file;
    },
    },
};
</script>

<style scoped lang="less">
.user-conter {
  padding: 20px;
  text-align: center;
}
.user-conter div {
  margin: 15px 0;
}
.user-conter input {
  border-radius: 10px;
  border: 1px solid #ccc;
  line-height: 30px;
  padding-left: 10px;
  width: 250px;
}
.user-header {
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
img {
  width: 200px;
  height: 200px;
}
#img {
  position: relative;
  top: 14px;
  left: 5px;
}
</style>
