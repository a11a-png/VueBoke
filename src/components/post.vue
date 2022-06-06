<template>
  <article class="post post-list">
    <div class="post-entry">
      <div class="feature">
        <img v-if="post.articlesCover != null" :src="post.articlesCover" />
        <img v-else src="../../public/boke.png" alt="" />
      </div>
      <h1 class="entry-title">
        <a href="#" @click="lookboke(post.articlesId)">
          <span style="color: #ff6d6d; font-weight: 600">[{{post.technology}}] </span>
          <span style="color: #ff6d6d; font-weight: 600">[{{post.sortName}}] </span>
          <span v-html="post.articlesTitle"></span>
        </a>
      </h1>
      <div class="p-time">
        <!--{{post.articlesDate | formatDate}} 過濾管道符   -->
        <i class="iconfont iconmeditor-time"></i>
        {{ post.articlesDate | formatDate }}
        <i
          class="iconfont iconfire"
          style="margin-left: 5px; color: #ff6d6d"
        ></i>
      </div>
      <div class="articlesContent">
          <p class="summary" v-html="post.articlesContent"></p>
      </div>
      <footer class="entry-footer">
        <div class="post-more">
          <i class="iconfont iconfish-li" style="font-size: 25px"></i>
        </div>
        <div class="info-meta">
          <div class="comnum">
            <span>
              <i class="iconfont iconcomment"></i>
              <a href="https://zhebk.cn/Web/Akina.html"
                >{{ post.articlesCount }} 条评论</a
              >
            </span>
          </div>
          <div class="views">
            <span><i class="iconfont iconeyes"></i>{{ post.articlesViews }} 訪問</span>
          </div>
        </div>
      </footer>
    </div>
    <hr />
  </article>
</template>

<script>
import request from "../util/request";
let padDate = (value) => {
  return value < 10 ? "0" + value : value;
};
export default {
  name: "post",
  props: {
    post: {
      type: Object,
    },
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
  methods: {
    lookboke() {
      request.get("/lookboke?articlesId="+this.post.articlesId).then((res) => {
        console.log(res);    
        if (res.code == 0) {
          sessionStorage.setItem("post",JSON.stringify(res.data[0]));
          sessionStorage.setItem("comments",JSON.stringify(res.data[1].datalist));
          sessionStorage.setItem("count",JSON.stringify(res.data[1].count));
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
  },
  beforeDestroy(){
     //this.$bus.$emit("post",this.post.articlesId);
  }
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
    right: 0;
    top: 16px;
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

/******/
</style>
