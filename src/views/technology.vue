<template>
  <div class="technology">
    <banner isHome="true"></banner>
    <div class="technology-conter">
      <div v-if="this.count > 0">
        <section-title>
          <div class="technology-header">
            <div class="title">{{ technologydata[0].technology }}</div>
          </div>
        </section-title>
        <template v-for="item in technologydata">
          <post :post="item" :key="item.articlesId"></post>
        </template>
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
      <div v-else>
          <section-title>
          <div class="technology-header">
            <div class="title">無相關文章</div>
          </div>
        </section-title>
      </div>
    </div>
  </div>
</template>

<script>
import post from "../components/post.vue";
import sectionTitle from "@/components/section-title";
import banner from "@/components/banner";

export default {
  name: "technology",
  data() {
    return {
      technologydata: JSON.parse(sessionStorage.getItem("selecttechologty")),
      currentPage: 1,
      pageSize: 3,
      count: JSON.parse(sessionStorage.getItem("techologtycount")),
    };
  },
  methods: {
    technology(id) {
      //查看所有文章
      request
        .get(
          "/selecttechologty?technologyid=" + id + "&curr=" + this.currentPage
        )
        .then((res) => {
          if (res.code == 0) {
            sessionStorage.setItem(
              "selecttechologty",
              JSON.stringify(res.data[0])
            );
            sessionStorage.setItem(
              "techologtycount",
              JSON.stringify(res.data[1])
            );
            if (window.location.pathname == "/technology") {
              location.reload();
            } else {
              this.$router.push(res.action);
            }
          } else {
            this.$message({
              type: "error",
              message: res.msg,
            });
          }
        });
    },
    handleCurrentChange() {
      //改变当前页码触发
      this.currentPage = current;
      this.load();
    },
  },
  components: {
    post,
    sectionTitle,
    banner,
  },
};
</script>

<style scoped lang="less">
.technology-conter {
  margin: 0 auto;
  padding: 0 10px;
  max-width: 800px;
}
.technology-conter div {
  margin: 15px 0;
}
</style>