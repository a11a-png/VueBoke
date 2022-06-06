<template>
  <div>
    <article
      v-for="postdata in postdt"
      :key="postdata.articlesId"
      class="post post-list"
    >
      <div class="post-entry">
        <div class="feature">
          <img
            v-if="postdata.articlesCover != null"
            :src="postdata.articlesCover"
          />
          <img v-else src="../../../public/boke.png" alt="" />
        </div>
        <h1 class="entry-title">
          <a href="#" @click="lookboke(postdata.articlesId)">
            <span style="color: #ff6d6d; font-weight: 600">[{{postdata.technology}}] </span>
            <span style="color: #ff6d6d; font-weight: 600">[{{postdata.sortName}}] </span>
            {{ postdata.articlesTitle }}
          </a>
        </h1>
        <div class="p-time">
          <!--{{post.articlesDate | formatDate}} 過濾管道符   -->
          <i class="iconfont iconmeditor-time"></i>
          {{ postdata.articlesDate | formatDate }}
          <i
            class="iconfont iconfire"
            style="margin-left: 5px; color: #ff6d6d"
          ></i>
        </div>
        <div class="articlesContent">
              <p class="summary" v-html="postdata.articlesContent"></p>
        </div>
      </div>
      <hr />
    </article>
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
</template>

<script>
import request from "../../util/request";
import postvue from "../post.vue";

export default {
  name: "mypost",
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem("user")) || {},
      currentPage: 1,
      pageSize: 3,
      count:0,
      postdt: [],
    };
  },
  components: {
    postvue,
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      var form = new FormData();
      form.append("userid", this.user.userid);
      form.append("curr", this.currentPage);
      request.post("/getmypost", form).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.postdt = res.data.datalist;
          this.count = res.data.count;
          this.$forceUpdate();
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
      });
    },
    handleCurrentChange(current){
        //改变当前页码触发
        this.currentPage=current;
        this.load();
    },
    lookboke(articlesId) {
      request.get("/lookboke?articlesId="+articlesId).then((res) => {  
        if (res.code == 0) {
          console.log(res);
          sessionStorage.setItem("post",JSON.stringify(res.data[0]));
          // if(res.data[1].datalist.length==0){
          //   sessionStorage.setItem("comments",null);
          // }else{
          //     sessionStorage.setItem("comments",JSON.stringify(res.data[1].datalist));
          // }
          sessionStorage.setItem("count",JSON.stringify(res.data[1].count));
          this.$router.push(res.action);        
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.articlesContent {
   height: 90px;
   overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 3;
   -webkit-box-orient: vertical;
}
.post {
  margin: 0 0 4% 0;
  position: relative;
  padding: 15px 30px;
}

.post-entry {
  .feature {
    position: absolute;
    margin-top: 10px;

    img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 50%;
      padding: 2px;
      border: 1px solid #dadada;
      position: relative;
      transition: all 0.2s linear;
      overflow: hidden;
      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }

  .entry-title {
    font-size: 21px;
    font-weight: 600;
    line-height: 50px;
    margin: 0 0 0 17%;
    position: relative;
    z-index: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 70%;
    color: #737373;

    & a:hover {
      color: #8fd0cc;
    }
  }

  .p-time {
    position: absolute;
    right: 20px;
    top: 33px;
    font-size: 12px;
    color: #989898;
    letter-spacing: 1px;
    font-family: din, "Hiragino Sans GB", "Microsoft Yahei", Arial, sans-serif;
    display: flex;
    align-items: center;
  }

  p.summary {
    min-height: 60px;
    margin: 0 0 0 17%;
    font-size: 15px;
    color: #6f6f6f;
    letter-spacing: 1px;
    line-height: 30px;
  }

  footer.entry-footer {
    margin: 0 0 0 17%;
    list-style: none;

    .post-more {
      margin-top: 10px;
      text-align: right;
      color: #a0dad0;

      a:hover {
        color: #737373;
      }
    }

    .info-meta {
      margin-top: 10px;
      font-family: din, "Hiragino Sans GB", "Microsoft Yahei", Arial, sans-serif;
      position: absolute;
      top: 20px;
      opacity: 0;
      padding-top: 8px;
      border-top: 1px solid #ddd;
      -webkit-transform: translate3d(-150px, 0, 0);
      transform: translate3d(-150px, 0, 0);
      visibility: hidden;
      transition: 0.7s all ease;
      -webkit-transition: 0.6s all ease;
      -moz-transition: 0.6s all linear;
      -o-transition: 0.6s all ease;
      -ms-transition: 0.6s all ease;

      span,
      a {
        color: #b3b3b3;
        font-size: 12px;
      }

      i {
        margin-top: 3px;
        margin-right: 10px;
        float: left;
      }
    }

    .comnum {
      float: left;
    }
  }
}

.post-entry:hover footer.entry-footer .info-meta {
  -webkit-transform: translate3d(-230px, 0, 0);
  transform: translate3d(-230px, 0, 0);
  opacity: 1;
  visibility: visible;
}

.post hr {
  width: 30%;
  height: 1px;
  margin: 0 auto;
  border: 0;
  background: #efefef;
}

/*******/
@media (max-width: 1060px) {
  .info-meta {
    display: none;
  }
}
@media (max-width: 800px) {
  .post-entry {
    .feature img {
      width: 50px;
      height: 50px;
    }
    .entry-title {
      font-size: 16px;
      line-height: 30px;
      margin: 0 0 0 65px;
    }
    .p-time {
      position: relative;
      margin: -15px 0 0 65px;
    }
    p.summary {
      margin: 20px 0 0 65px;
      font-size: 14px;
      height: 30px;
      overflow: hidden;
    }
    .post-more {
      display: none;
    }
  }
  .post-list hr {
    margin-top: 20px;
  }
}
</style>
