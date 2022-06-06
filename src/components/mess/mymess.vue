<template>
  <div class="mymessage">
    <div v-for="mesg in message" :key="mesg.messageId">
       <div v-if="mesg.type==1">
           <div style="border:1px solid #ccc; border-radius:10px; padding:10px; margin-bottom:15px;">
               <h1 style="color: #ff6d6d; font-weight: 600; font-size:30px;">{{mesg.articlesTitle}}</h1>
               <hr>
               <div style="overflow: hidden;">
                   <span style="float:left">用户：{{mesg.fromName}} 评论了你的文章</span>
                   <span style="float:right">{{mesg.messDate | formatDate}}</span>
               </div>
               <hr>
              <div>
                  {{mesg.message}}
              </div>
           </div>
       </div>
       <div v-if="mesg.type==2">
           <div v-if="mesg.touserid===user.userid" style="border:1px solid #ccc; border-radius:10px; padding:10px; margin-bottom:15px;">
              <h1 style="color: #ff6d6d; font-weight: 600; font-size:30px;">{{mesg.articlesTitle}}</h1>
              <hr>
              <div style="overflow: hidden;">
                 <span style="float:left">用户：{{mesg.fromName}} 回复了 {{mesg.toName}}</span>
                 <span style="float:right">{{mesg.messDate | formatDate}}</span>
              </div>
              <hr>
              <div>
                  {{mesg.message}}
              </div>
           </div> 
           <div v-else style="border:1px solid #ccc; border-radius:10px; padding:10px; margin-bottom:15px;">
              <h1 style="color: #ff6d6d; font-weight: 600; font-size:30px;">{{mesg.articlesTitle}}</h1>
              <hr>
              <div style="overflow: hidden;">
                 <span style="float:left">用户：{{mesg.fromName}} 回复了 {{mesg.toName}}</span>
                 <span style="float:right">{{mesg.messDate | formatDate}}</span>
              </div>
              <hr>
              <div>
                  {{mesg.message}}
              </div>
           </div>
       </div>
       <div v-if="mesg.type==0">
           <div style="border:1px solid #ccc; border-radius:10px; padding:10px; margin-bottom:15px;">
              <h1 style="color: #ff6d6d; font-weight: 600; font-size:30px;">{{mesg.articlesTitle}}</h1>
              <hr> 
              <div style="overflow: hidden;">                  
                   <span v-if="mesg.potsid!=null" style="float:left">用户：{{mesg.fromName}} 给你的文章 {{mesg.message}}</span>
                   <span v-else style="float:left">用户：{{mesg.fromName}} {{mesg.message}}</span>
                   <span style="float:right">{{mesg.messDate | formatDate}}</span>
              </div>
               <hr> 
           </div>
       </div>    

    </div>

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

export default {
  name: "mymess",
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem("user")) || {},
      currentPage: 1,
      pageSize: 10,
      count: 0,
      message:{}
    };
  },
  methods: {
    load() {
      var form = new FormData();
      form.append("userid", this.user.userid);
      form.append("curr", this.currentPage);
      request.post("/getmyMessage", form).then((res) => {
          console.log(res);
        if (res.code === 0) {
          this.message = res.data.datalist;
          this.count = res.data.count;
          this.$bus.$emit("mes",0);
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
  },
  mounted() {
      this.load();
  },
};
</script>

<style scoped>
   .mymessage{
       color: black;
   }

</style>
