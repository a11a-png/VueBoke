<template>
  <div class="comment">
    <div class="comment-head">
      <div class="user-avatar">
        <span class="img">
          <img
            v-if="comment.userPhoto == null"
            src="../../public/default.png"
            alt=""
          />
          <img v-else :src="comment.userPhoto" alt="" />
        </span>
      </div>
      <div class="head-right">
        <section-title>
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <div>
              <span class="from-user user-name">{{ comment.userName }}
                <span v-if="comment.userId==postid" style="color:red;">[作者]</span>
              </span>
              <!-- <span class="to-user" v-if="comment.toUserId"><span style="margin: 0 5px;">@</span><span class="user-name">{{comment.toUserName}}</span></span> -->
            </div>
            <div style="font-size: 13px">
              <span style="color: #9c9c9c; margin-right: 20px">{{
                comment.commentDate | formatDate
              }}</span>
              <span
                @click="showEditor(comment.userName, comment.commentId)"
                style="cursor: pointer"
                >回复</span
              >
            </div>
          </div>
        </section-title>
      </div>
    </div>
    <div class="comment-body">
      <div class="content-text">
        <p>{{ comment.commentContent }}</p>
        <!-- 子评论内容 -->
        <div
          class="child"
          v-for="item in comment.childList"
          :key="item.commentId"
          style="margin-top: 10px"
        >
          <template v-if="item != null">
            <div class="comment-head">
              <div class="user-avatar">
                <span class="img">
                  <img
                    v-if="item.userPhoto == null"
                    src="../../public/default.png"
                    alt=""
                  />
                  <img v-else :src="item.userPhoto" alt="" />
                </span>
              </div>
              <div class="head-right">
                <section-title>
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                    "
                  >
                    <div style="font-size: 15px">
                      <span class="from-user user-name">{{
                        item.userName
                      }} 
                       <span v-if="item.userId==postid" style="color:red;">[作者]</span>
                      </span>
                      回复：
                      <span class="from-user user-name">{{
                        item.toUserName
                      }}
                       <span v-if="item.toUserId==postid" style="color:red;">[作者]</span>
                      </span>
                      <!-- <span class="to-user" v-if="comment.toUserId"><span style="margin: 0 5px;">@</span><span class="user-name">{{comment.toUserName}}</span></span> -->
                    </div>
                    <div style="font-size: 13px">
                      <span style="color: #9c9c9c; margin-right: 20px">{{
                        item.commentDate | formatDate
                      }}</span>
                      <span
                        @click="showEditor(item.userName, item.commentId)"
                        style="cursor: pointer"
                        >回复</span
                      >
                    </div>
                  </div>
                </section-title>
              </div>
            </div>
            <div class="comment-body">
              <div class="content-text">
                <p>{{ item.commentContent }}</p>

                <!-- 发表评论 -->
                <div style="display: none" :id="item.commentId" class="none">
                  <el-form :model="form">
                    <el-form-item>
                      <span class="img">
                        <img
                          v-if="item.userPhoto == null"
                          src="../../public/default.png"
                          alt=""
                        />
                        <img v-else :src="item.userPhoto" alt="" />
                        <span style="margin-bottom: 10px" v-text="text"></span>
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
                      <font-awesome-icon
                        :icon="['fas', 'paper-plane']"
                        size="2x"
                        style="cursor: pointer; color: blue"
                        @click="tocomments(item.userId)"
                      ></font-awesome-icon>
                    </div>
                  </el-form>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- 发表评论 -->
      <div style="display: none" :id="comid" class="none">
        <el-form :model="form">
          <el-form-item>
            <span class="img">
              <img
                v-if="users.userPhoto == null"
                src="../../public/default.png"
                alt=""
              />
              <img v-else :src="users.userPhoto" alt="" />
              <span style="margin-bottom: 10px" v-text="text"></span>
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
            <font-awesome-icon
              :icon="['fas', 'paper-plane']"
              size="2x"
              style="cursor: pointer; color: blue"
              @click="tocomments(null)"
            ></font-awesome-icon>
          </div>
        </el-form>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import sectionTitle from "@/components/section-title";
import commentMessageEditor from "comment-message-editor";
import request from "../util/request";

export default {
  name: "comment",
  props: {
    comment: {
      type: Object,
    },
    users: {
      type: Object,
    },
    postid:{
      type: Number
    }
  },
  data() {
    return {
      showCommentEditor: false,
      form: {},
      text: "参与评论：",
      comid: this.comment.commentId,
    };
  },
  components: {
    sectionTitle,
    commentMessageEditor,
  },
  methods: {
    reply(id) {
      const ref = `comment${id}`;
    },
    submitReply(v) {
      console.log(v);
    },
    close() {
      this.showCommentEditor = false;
    },
    tocomments(userId) {
      console.log(this.comment.commentContent);
      //判断是否登录
      if (this.users.userid == null) {
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
      this.form.fromuserid = this.users.userid; //发送方ID
      if (userId == null) {
        this.form.touserid = this.comment.userId; //接收方ID ：评论人ID
      } else {
        this.form.touserid = userId; //接收方ID ：评论人ID
      }
      this.form.potsid = this.comment.articleId; //评论文章ID
      this.form.parentCommentId = this.comment.commentId; //设置父评论ID
      request.post("/replycomments", this.form).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg,
          });
          //更新session
          sessionStorage.setItem("comments", JSON.stringify(res.data.datalist));
          sessionStorage.setItem("count", JSON.stringify(res.data.count));
          location.reload();
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
      });
    },
    showEditor(userName, commentId) {
      if (this.$root.bscomid != "") {
        document.getElementById("" + this.$root.bscomid + "").style =
          "display:none";
      }
      document.getElementById(commentId).style = "display:block";
      this.$root.bscomid = commentId;
      this.text = "回复：" + userName;
    },
  },
};
</script>

<style scoped lang="less">
.el-textarea {
  width: 90% !important;
}
.comment {
  margin: 20px 0;
}
.comment-head {
  display: flex;
  .head-right {
    flex: 1;
  }
  .user-name {
    color: #8fd0cc;
  }
}
.comment-body {
  padding-left: 80px;
  .content-text {
    /*padding-bottom: 30px;*/
    margin-bottom: 30px;
    font-size: 14px;
    color: black;
    line-height: 1.3rem;
  }
}
.user-avatar {
  width: 50px;
  height: 50px;
  margin-right: 30px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
}
@media (max-width: 600px) {
  .comment-body {
    padding-left: 15px;
    .content-text {
      margin-top: 10px;
    }
  }
  .user-avatar {
    margin-right: 10px;
  }
}
.img img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #e8e8ed;
  margin-right: 20px;
}
.child img {
  width: 20px;
  height: 20px;
}
</style>
