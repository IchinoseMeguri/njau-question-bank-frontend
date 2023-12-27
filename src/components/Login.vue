<template>
  <div id="picture">
    <title></title>
    <div class="common-layout">
      <el-container>
        <el-header></el-header>
        <h1 align="center" style="color: white"></h1>

        <el-main>
          <div align="center" style="position: relative; top: 20px">
            <el-card align="center" style="width: 300px; background-color: rgba(255, 255, 255, 0.8)">
              <h1 align="center">登录</h1>
              <div>
                <el-row>
                  <p>用户名</p>
                  <el-input v-model="name" maxlength="20" placeholder="用户名" />
                </el-row>
                <el-row>
                  <p>密码</p>
                  <el-input v-model="pwd" type="password" maxlength="20" placeholder="密码" show-password />
                </el-row>
                <p></p>
              </div>
              <div align="center">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button @click="register">注册</el-button>
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
import { loginInfoStore } from "../store/loginInfo.js";

export default {
  name: "Login",
  data() {
    return {
      name: "",
      pwd: "",
    };
  },
  methods: {
    login() {
      var this_vue = this;
      requestService({
        url: "/login?name=" + this.name + "&pwd=" + this.pwd,
        method: "get",
      }).then(function (response) {
        let res = response.data;
        if (res == 1) {
          ElMessage.success("登陆成功");
          requestService({
            url: "/user/getUserInfo?name=" + this_vue.name,
            method: "get",
          }).then(function (response) {
            let res = response.data;
            loginInfoStore.data = {
              user_id: res.user_id,
              user_type: res.user_type,
              user_name: res.user_name,
              user_password: res.user_password,
            };
            sessionStorage.setItem('loginInfo', JSON.stringify(loginInfoStore.data));
            this_vue.$router.push("/homepage");
          })
        }
        else ElMessage.error("登陆失败");
      }).catch(function (error) {
        console.log(error);
      });
    },
    register() {
      this.$router.push("/register");
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
