<template>
  <div class="Writeboke">
    <div class="site-content">
      <section-title>
        <div class="Writeboke-header">
          <div class="title">发表文章</div>
          <div class="apply">
            <el-button type="primary" @click="pushboke">发表</el-button>
          </div>
        </div>
      </section-title>
      <div class="Writeboke-conter">
        <h2 style="text-align: center">文章内容</h2>
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="文章分类：" prop="sortId">
            <el-select v-model="form.sortId" placeholder="请选择">
              <el-option
                v-for="op in sortlist"
                :key="op.sortId"
                :value="op.sortId"
                :label="op.sortName"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="知识标签：" prop="technologyId">
            <el-select v-model="form.technologyId" placeholder="请选择">
              <el-option
                v-for="op in technologylist"
                :key="op.id"
                :value="op.id"
                :label="op.technology"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文章标题：" prop="articlesTitle">
            <el-input
              prefix-icon="el-icon-user-solid"
              v-model="form.articlesTitle"
              placeholder="文章标题"
            ></el-input>
          </el-form-item>
        </el-form>
        <div id="div1"></div>
      </div>
    </div>
  </div>
</template>

<script>
import sectionTitle from "@/components/section-title";
import { Message } from "element-ui";
import Vue from "vue";
import request from "../util/request";
import E from "wangeditor";

Vue.prototype.$message = Message;
let editor;
export default {
  name: "Writeboke",
  components: {
    sectionTitle,
  },
  data() {
    return {
      form: {},
      sortlist: JSON.parse(sessionStorage.getItem("sort")) || [],
      technologylist: JSON.parse(sessionStorage.getItem("technology")) || [],
      user: JSON.parse(sessionStorage.getItem("user")) || [],
      sortId: 0,
      rules: {
        articlesTitle: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
        ],
        sortId: [{ required: true, message: "请选择分类", trigger: "change" }],
        technologyId: [{ required: true, message: "请选择知识标签", trigger: "change" }],
      },
    };
  },
  mounted() {
    //生命周期钩子，插入vue时钩子
    if (!editor) {
      editor = new E("#div1");
      //配置本地上传图片
      editor.config.uploadImgServer =
        "http://localhost:8801/uploadfile?token=" + this.user.token;
      editor.config.uploadFileName = "file";

      editor.create();
    }
  },
  methods: {
    pushboke() {
      //自定义form表单规则判断是否成功
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.userId=this.user.userid;
          this.form.userName=this.user.userName;
          this.form.articlesContent = editor.txt.html();
          this.form.focusMyuserId=this.user.focusMyuserId;
          request.post("/saveboke", this.form).then((res) => {
            if (res.code == 0) {
              console.log(res)
              this.$message({
                type: "success",
                message: res.msg,
              });
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
        }
      });
    },
  },
};
</script>

<style lang="less">
.Writeboke {
  padding-top: 40px;
}
.Writeboke-header {
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
.Writeboke-conter {
  margin: 50px auto;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 15px;
}
.w-e-text-container {
  height: 500px !important; /*!important是重点，因为原div是行内样式设置的高度300px*/
}
.el-select el-select--normal {
  z-index: 1 !important;
}
// wangeditor z-index层级太高的解决方案
.w-e-toolbar{
        z-index: 2 !important;
    }
    .w-e-menu {
        z-index: 3 !important;
    }
    .w-e-text-container {
        z-index: 1 !important;
    }
.w-e-droplist{
   z-index: 9999 !important;
}    
.w-e-list li{
  z-index: 4 !important;
}
</style>
