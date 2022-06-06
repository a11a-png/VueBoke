<template>
  <div class="contater">
    <div v-if="myfocusList.length > 0">
      <div v-for="item in myfocusList" :key="item.userid">
        <el-row>
          <el-col :span="4">
            <div style="margin-right: 15px">
                <el-image
                  v-if="item.userPhoto != null && item.userPhoto != ''"
                  :src="item.userPhoto"
                  :preview-src-list="[item.userPhoto]"
                  style="border-radius: 10px; cursor: pointer"
                >
                </el-image>
              <img
                v-else
                src="../../../public/default.png"
                style="border-radius: 10px; cursor: pointer"
              >
            </div>
          </el-col>
          <el-col :span="16">
            <div>账号：{{ item.userName }}</div>
            <div>
              郵箱：
              <span v-if="item.userEmail != null && item.userEmail != ''">
                {{ item.userEmail }}
              </span>
              <span v-else> 无 </span>
            </div>
            <div>注冊時間：{{ item.userBirthday | formatDate }}</div>
          </el-col>
        </el-row>
        <hr />
      </div>
    </div>
    <div v-else>無</div>
  </div>
</template>

<script>
import request from "../../util/request";

export default {
  name: "myfocus",
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem("user")) || {},
      myfocusList: [],
      userPhoto:[]
    };
  },
  methods: {
    load() {
      request
        .get("/selectmyfocus", {
          params: { focusUserId: this.user.focusUserId },
        })
        .then((res) => {
          if (res.code == 0) {
            this.myfocusList = res.data;
          } else {
            this.$message({
              type: "error",
              message: res.msg,
            });
          }
        });
    },
  },
  mounted() {
    this.load();
  },
};
</script>

<style scoped>
.contater {
  padding: 15px;
}
img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid #e8e8ed;
}
</style>
