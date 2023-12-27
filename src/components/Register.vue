<template>
  <div id="picture">
    <title></title>
    <div class="common-layout">
      <el-container>
        <el-header>
          <h1 align="center" style="color: white"></h1>
        </el-header>
        <el-main>
          <div align="center" style="position: relative; top: 20px">
            <el-card align="center" style="width: 300px; background-color: rgba(255, 255, 255, 0.8)">
              <h1 align="center">注册</h1>
              <div>
                <el-row>
                  <p>用户名</p>
                  <el-input v-model="name" maxlength="20" placeholder="用户名" />
                </el-row>
                <el-row>
                  <p>密码</p>
                  <el-input v-model="pwd" type="password" maxlength="20" placeholder="密码" show-password />
                </el-row>
                <el-row>
                  <p>确认密码</p>
                  <el-input v-model="pwd2" type="password" maxlength="20" placeholder="确认密码" show-password />
                </el-row>
              </div>
              <p></p>
              <div align="center">
                <el-button type="primary" @click="register">注册</el-button>
                <el-button @click="back">返回</el-button>
              </div>
            </el-card>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { requestService } from "../request/request.js";
import { ElMessage } from "element-plus";
export default {
  name: "Register",
  data() {
    return {
      name: "",
      pwd: "",
      pwd2: "",
    };
  },
  methods: {
    register() {
      if (this.pwd != this.pwd2) ElMessage.error("密码与确认密码不一致");
      else if (this.name == "") ElMessage.error("用户名不能为空");
      else if (this.pwd == "") ElMessage.error("密码不能为空");
      else {
        var this_vue = this;
        requestService({
          url:
            "/register?name=" +
            this.name +
            "&pwd=" +
            this.pwd,
          method: "get",
        }).then(function (response) {
          let res = response.data;
          if (res == -1) ElMessage.error("该用户名已被注册");
          else if (res == 0) ElMessage.error("注册失败");
          else {
            ElMessage.success("注册成功");
            setTimeout(this_vue.$router.push("/login"), 1000);
          }
        });
      }
    },
    back() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.read-the-docs {
  color: #888;
}

#picture {
  background: url("../assets/pictures/bkg.jpg");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100%;
}
</style>
