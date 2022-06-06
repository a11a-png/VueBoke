<template>
  <div class="articles">
    <banner :isHome="true"></banner>
    <div class="site-content animate">
      <!-- 文章目录 -->
      <div id="article-menus">
        <h1>作者:{{ post.userName }}</h1>
        <h1>分类：{{ post.sortName }}</h1>
        <div style="display: block">
          <a v-if="isfocusUser" href="#" style="color: red" @click="closeauthor(post.userId)"
            >取关作者</a>
          <a v-else href="#" style="color: red" @click="focusauthor(post.userId)"
            >關注作者</a>
        </div>

        <div style="display: block">
          <a href="#" style="color: red">作者信息</a>
        </div>
        <!-- <img v-if="post.articlesCover != null" :src="post.articlesCover" />
         <img v-else src="../../public/boke.png" alt="" /> -->
      </div>
      <main class="site-main">
        <article class="hentry">
          <!-- 文章头部 -->
          <header class="entry-header">
            <!-- 标题输出 -->
            <h1 class="entry-title">{{ post.articlesTitle }}</h1>
            <hr />
            <div class="breadcrumbs">
              <div id="crumbs">
                编写时间：{{ post.articlesDate | formatDate }}
              </div>
            </div>
          </header>
          <!-- 正文输出 -->
          <div class="entry-content" v-highlight>
            <div v-html="post.articlesContent" class="articlesContent"></div>
          </div>
          <!-- 文章底部 -->
          <section-title>
            <footer class="post-footer">
              <!-- 阅读次数 -->
              <div class="post-like">
                <i class="iconfont iconeyes"></i>
                <span class="count">{{ post.articlesViews }}</span>
              </div>
              <div class="donate">
                <span>赏</span>
                <ul class="donate_inner">
                  <li class="wedonate">
                    <img src="http://cdn.fengziy.cn/gblog/wexin_pay.png" />
                    <p>微信</p>
                  </li>
                  <li class="alidonate">
                    <img src="http://cdn.fengziy.cn/gblog/ali_pay.jpg" />
                    <p>支付宝</p>
                  </li>
                </ul>
              </div>
              <!-- 文章标签 -->
              <div class="post-tags">
                <span style="margin-right: 15px">
                  <font-awesome-icon
                    :icon="this.likeicon"
                    size="lg"
                    border
                    style="cursor: pointer"
                    @click="like"
                    id="like"
                  ></font-awesome-icon>
                  <span style="font-size: 20px">{{ post.likeCount }}</span>
                </span>
                <span style="margin-right: 15px">
                  <font-awesome-icon
                    :icon="this.collecticon"
                    size="lg"
                    border
                    style="cursor: pointer"
                    @click="collect"
                    id="collect"
                  ></font-awesome-icon>
                  <span style="font-size: 20px">{{ post.collectCount }}</span>
                </span>
                <span style="margin-right: 15px">
                  <font-awesome-icon
                    :icon="['far', 'comment']"
                    size="lg"
                    border
                    style="cursor: pointer"
                    @click="message"
                  ></font-awesome-icon>
                  <span style="font-size: 20px">{{ post.articlesCount }}</span>
                </span>
              </div>
            </footer>
          </section-title>

          <!--声明-->
          <div class="open-message">
            <p>
              声明：Gblog博客|版权所有，违者必究|如未注明，均为原创|本网站采用<a
                href="https://creativecommons.org/licenses/by-nc-sa/3.0/"
                target="_blank"
                >BY-NC-SA</a
              >协议进行授权
            </p>
            <p>
              转载：转载请注明原文链接 -
              <a href="/">看一遍闭着眼都会安装Lua了</a>
            </p>
          </div>
          <!--评论-->
          <div class="comments" v-if="comments.length > 0">
            <comment
              v-for="item in comments"
              :key="item.commentId"
              :comment="item"
              :users="user"
              :postid="post.userId"
            >
              <template v-if="item.length">
                <comment :comment="item"></comment>
              </template>
            </comment>
            <!-- 分页 -->
            <div class="block">
              <el-pagination
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="count"
              >
              </el-pagination>
            </div>
          </div>

          <el-form :model="form">
            <h1 style="margin-bottom: 10px">参与评论:</h1>
            <el-form-item>
              <span class="img">
                <img
                  v-if="user.userPhoto == null"
                  src="../../public/default.png"
                  alt=""
                />
                <img v-else :src="user.userPhoto" alt="" />
              </span>
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请发表有价值的评论"
                v-model="form.message"
                id="comments"
              >
              </el-input>
            </el-form-item>
            <div style="text-align: right">
              <el-button type="primary" @click="tocomments">评论</el-button>
            </div>
          </el-form>
        </article>
      </main>
    </div>
  </div>
</template>

<script>
import Banner from "@/components/banner";
import sectionTitle from "@/components/section-title";
import comment from "@/components/comment";
import menuTree from "@/components/menu-tree";
import { fetchComment } from "../api";
import request from "../util/request";

let padDate = (value) => {
  return value < 10 ? "0" + value : value;
};
export default {
  name: "articles",
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem("user")) || {},
      comments: JSON.parse(sessionStorage.getItem("comments")) || [],
      count: JSON.parse(sessionStorage.getItem("count")) || 0, //评论总数
      currentPage: 1, //当前页数
      pageSize: 3,
      post: JSON.parse(sessionStorage.getItem("post")),
      likeUserId: JSON.parse(sessionStorage.getItem("post")).likeUserId.split(
        "_"
      ),
      focusauthorId:JSON.parse(sessionStorage.getItem("user")).focusUserId.split("_"),
      collectUserId: JSON.parse(
        sessionStorage.getItem("post")
      ).collectUserId.split("_"),
      likeicon: ["far", "thumbs-up"],
      collecticon: ["fas", "heart"],
      form: {},
      Likeauthor: {},
      isfocusUser:false  //是否关注作者
    };
  },
  props: {
    postdata: {
      type: Object,
    },
  },
  components: {
    Banner,
    sectionTitle,
    comment,
    menuTree,
  },
  methods: {
    load() {
      request
        .get("/selectAllComments", {
          params: {
            pageSize: this.pageSize,
            currpage: this.currentPage,
            articlesId: this.post.articlesId,
          },
        })
        .then((res) => {
          if (res.data != null) {
            this.comments = res.data.datalist; //评论
            this.$forceUpdate();
            sessionStorage.setItem(
              "comments",
              JSON.stringify(res.data.datalist)
            );
          }
        });
    },
    handleCurrentChange(current) {
      //改变当前页码触发
      this.currentPage = current;
      this.load();
    },
    likefun() {
      if (this.user.userid != null) {
        for (var i = 0; i < this.likeUserId.length; i++) {
          console.log(this.likeUserId[i]);
          if (this.likeUserId[i] == this.user.userid) {
            this.likeicon = ["fas", "thumbs-up"];
            document.getElementById("like").style =
              "color:red;cursor: pointer;";
            return;
          }
        }
      }
      this.likeicon = ["far", "thumbs-up"];
      document.getElementById("like").style = "cursor: pointer;";
    },
    collectfun() {
      if (this.user.userid != null) {
        for (var i = 0; i < this.collectUserId.length; i++) {
          console.log(this.collectUserId[i]);
          if (this.collectUserId[i] == this.user.userid) {
            this.collecticon = ["fas", "heart"];
            document.getElementById("collect").style =
              "color:red;cursor: pointer;";
            return;
          }
        }
      }
      this.collecticon = ["far", "heart"];
      document.getElementById("collect").style = "cursor: pointer;";
    },
    like() {
      //判断是否登录
      if (this.user.userid == null) {
        this.$message({
          type: "error",
          message: "请先进行登录",
        });
        return;
      }
      let formatDate = new FormData();
      var str = this.likeicon[0];
      if (str === "far") {
        request
          .post("/addlike", {
            potsid: this.post.articlesId,
            fromuserid: this.user.userid,
            touserid: this.post.userId,
            add: 0,
          })
          .then((res) => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: res.msg,
              });
              this.$set(this.post, "likeCount", res.data.likeCount);
              this.$set(this.post, "likeUserId", res.data.likeUserId);
              sessionStorage.setItem("post", JSON.stringify(this.post));
              this.likeicon = ["fas", "thumbs-up"];
              document.getElementById("like").style =
                "color:red;cursor: pointer;";
            } else {
              this.$message({
                type: "success",
                message: res.msg,
              });
            }
          });
      } else {
        request
          .post("/addlike", {
            potsid: this.post.articlesId,
            fromuserid: this.user.userid,
            touserid: this.post.userId,
            add: -1,
          })
          .then((res) => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: res.msg,
              });
              this.$set(this.post, "likeCount", res.data.likeCount);
              this.$set(this.post, "likeUserId", res.data.likeUserId);
              sessionStorage.setItem("post", JSON.stringify(this.post));
              document.getElementById("like").style = "cursor: pointer;";
              this.likeicon = ["far", "thumbs-up"];
            } else {
              this.$message({
                type: "success",
                message: res.msg,
              });
            }
          });
      }
    },
    collect() {
      //判断是否登录
      if (this.user.userid == null) {
        this.$message({
          type: "error",
          message: "请先进行登录",
        });
        return;
      }
      let formatDate = new FormData();
      formatDate.append("articlesId", this.post.articlesId);
      var str = this.collecticon[0];
      if (str === "far") {
        formatDate.append("add", 0);
        request.post("/addcollect", formatDate).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: res.msg,
            });
            this.$set(this.post, "collectCount", res.data.collectCount);
            this.$set(this.post, "collectUserId", res.data.collectUserId);
            sessionStorage.setItem("post", JSON.stringify(this.post));
            this.collecticon = ["fas", "heart"];
            document.getElementById("collect").style =
              "color:red;cursor: pointer;";
          } else {
            this.$message({
              type: "success",
              message: res.msg,
            });
          }
        });
      } else {
        formatDate.append("add", -1);
        request.post("/addcollect", formatDate).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: res.msg,
            });
            this.$set(this.post, "collectCount", res.data.collectCount);
            this.$set(this.post, "collectUserId", res.data.collectUserId);
            sessionStorage.setItem("post", JSON.stringify(this.post));
            document.getElementById("collect").style = "cursor: pointer;";
            this.collecticon = ["far", "heart"];
          } else {
            this.$message({
              type: "success",
              message: res.msg,
            });
          }
        });
      }
    },
    message() {
      document.getElementById("comments").focus();
    },
    tocomments() {
      //判断是否登录
      if (this.user.userid == null) {
        this.$message({
          type: "error",
          message: "请先进行登录",
        });
        return;
      }
      if (this.form.message == null || this.form.message == "") {
        this.$message({
          type: "error",
          message: "请填写评论",
        });
        return;
      }
      this.form.fromuserid = this.user.userid; //发送方ID
      this.form.touserid = this.post.userId; //接收方ID ：文章作者
      this.form.potsid = this.post.articlesId;
      request.post("/tocomments", this.form).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg,
          });
          this.comments = res.data.datalist;
          this.count = res.data.count;
          //更新session
          sessionStorage.setItem("comments", JSON.stringify(res.data.datalist));
          sessionStorage.setItem("count", JSON.stringify(res.data.count));
          this.currentPage = 1;
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
      });
    },
    focusauthor() {
      //関注發佈文章作者
      request
        .post("/selectlikeauthor",{
            fromuserid: this.user.userid,
            touserid: this.post.userId,
            fromName: this.user.userName,
          })
        .then((res) => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: res.msg,
            });
            console.log(res.data);
            var str=this.user.focusUserId+res.data;
            this.$set(this.user,"focusUserId",str);
            this.focusauthorId=this.user.focusUserId.split("_");
            this.isfocusUser=true;
            sessionStorage.setItem("user",JSON.stringify(this.user));
            this.$forceUpdate();
          } else {
            this.$message({
              type: "error",
              message: res.msg,
            });
          }
        });
    },
    focususer(){
       //是否关注作者
       for(var i in this.focusauthorId){
          console.log(this.focusauthorId[i]);
           if(this.focusauthorId[i] == this.post.userId){
               this.isfocusUser=true;
           }
       }
    },
    closeauthor(){
       //取关作者
       request.get("/closeauthor",{params:{
         userid:this.user.userid,
         touserid:this.post.userId
       }}).then(res=>{
           if (res.code == 0) {
            this.$message({
              type: "success",
              message: res.msg,
            });
            //修改
            var str=this.user.focusUserId.replace("_"+this.post.userId,"");
            this.$set(this.user,"focusUserId",str);
             this.focusauthorId=str;
            this.isfocusUser=false;
            sessionStorage.setItem("user",JSON.stringify(this.user))
            this.$forceUpdate();
          } else {
            this.$message({
              type: "error",
              message: res.msg,
            });
          }
       })
    }
  },
  //過濾器
  filters: {
    //過濾方法
    formatDate: function (value) {
      //这里的 value 就是需要过滤的数据
      var date = new Date(value);
      var year = date.getFullYear();
      var month = padDate(date.getMonth() + 1);
      var day = padDate(date.getDate());
      var hours = padDate(date.getHours());
      var minutes = padDate(date.getMinutes());
      var seconds = padDate(date.getSeconds());
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
      );
    },
  },
  mounted() {
    this.likefun();
    this.collectfun();
    this.focususer();
  },
  created() {
    this.load();
    // 页面创建生命周期函数
    // this.$bus.$on("post", (value) => {
    //   this.articlesId = value;
    // });
    //this.getComment();
  },
  beforeDestroy() {
    // 离开页面生命周期函数
    //销毁bus总线
    //this.$bus.$off("post");
  },
};
</script>
<style scoped lang="less">
.el-textarea {
  width: 90% !important;
}
.img img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #e8e8ed;
  margin-right: 20px;
}
.site-content {
  position: relative;
  .site-main {
    padding: 80px 0 0 0;
  }
}
#article-menus {
  position: sticky;
  top: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  padding: 15px;
  width: 300px;
  transform: translateX(-120%) translateY(150px);
  font-size: 14px;
  line-height: 25px;
}
article.hentry {
  .entry-header {
    .entry-title {
      font-size: 23px;
      font-weight: 600;
      color: #737373;
      margin: 0.67em 0;

      &:before {
        content: "#";
        margin-right: 6px;
        color: #d82e16;
        font-size: 20px;
        font-weight: 600;
      }
    }

    hr {
      height: 1px;
      border: 0;
      background: #efefef;
      margin: 15px 0;
    }

    .breadcrumbs {
      font-size: 14px;
      color: #d2d2d2;
      text-decoration: none;
      margin-bottom: 30px;
    }
  }

  .entry-content {
  }

  footer.post-footer {
    width: 100%;
    padding: 20px 10px;
    margin-top: 30px;
    height: 65px;
    position: relative;
    i {
      font-size: 18px;
      margin-right: 5px;
    }
    .post-like {
      float: right;
      margin: 7px 0 0 20px;
    }

    .post-share {
      float: right;
      list-style: none;
      margin-right: 20px;
    }

    .donate {
      float: left;
      line-height: 36px;
      border-radius: 100%;
      -webkit-border-radius: 100%;
      -moz-border-radius: 100%;
      border: 1px solid #2b2b2b;
      &:hover {
        border: 1px solid goldenrod;
        span {
          color: goldenrod;
        }
      }
      span {
        color: #2b2b2b;
        padding: 10px;
        position: relative;
        cursor: pointer;
      }

      .donate_inner {
        display: none;
        margin: 0;
        list-style: none;
        position: absolute;
        left: 80px;
        top: -40px;
        background: #fff;
        padding: 10px;
        border: 1px solid #ddd;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        border-radius: 3px;
        &.show {
          display: block;
        }
        li {
          float: left;
        }

        img {
          width: 100px;
        }
        p {
          text-align: center;
          font-size: 15px;
          color: #d2d2d2;
          line-height: 1rem;
        }
      }

      .donate_inner:after,
      .donate_inner:before {
        content: "";
        position: absolute;
        left: 0;
        bottom: 45%;
        margin-left: -8px;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-right: 8px solid #fff;
      }

      .donate_inner:before {
        left: -1px;
        border-right: 8px solid #ddd;
      }
    }

    .post-tags {
      margin: 7px 0 0 20px;
      float: left;
      text-transform: uppercase;
      a:hover {
        color: #ff6d6d;
      }
    }
  }
  .open-message {
    margin: 50px 0;
    position: relative;
    background: #2b2b2b;
    padding: 10px 30px;
    border-radius: 3px;
    font-size: 14px;
    color: #fff;
    &:after {
      content: "";
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid #2b2b2b;
      position: absolute;
      top: -8px;
      left: 48%;
    }
    p {
      margin: 10px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    a {
      color: #a0dad0;
      padding: 0 5px;
    }
  }
}
@media (max-width: 1490px) {
  #article-menus {
    display: none;
  }
}
@media (max-width: 800px) {
  #article-menus {
    display: none;
  }
}
</style>
