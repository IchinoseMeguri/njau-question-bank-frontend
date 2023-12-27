<template>
    <div style="text-align: center; margin-top: 80px;">
        <div>
            <el-avatar :size="100" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
        </div>
        <h1>{{ username }}</h1>
    </div>
    <div style="text-align: center; margin-top: 80px;">
        <div style="display: inline-flex;">
            <el-card class="box-card" style="margin-right: 160px;">
                <p>累计刷题</p>
                <h1>{{ questionNum }}</h1>
            </el-card>
            <el-card class="box-card">
                <p>正确率</p>
                <h1>{{ correctRate }}</h1>
            </el-card>
        </div>
    </div>
    <div style="text-align: center; margin-top: 80px;">
        <div style="display: inline-flex;">
            <el-button type="danger" style="margin-right: 80px;" @click="changePwd = true">修改密码</el-button>
            <el-link href="/#/login" :underline="false"><el-button>退出登录</el-button></el-link>
        </div>
    </div>

    <el-dialog v-model="changePwd" title="修改密码" width="30%" :before-close="handleClose">
        <p></p>
        <el-row>
            <p>原密码</p>
            <el-input v-model="pwd" type="password" maxlength="20" placeholder="原密码" show-password />
        </el-row>

        <p></p>
        <el-row>
            <p>新密码</p>
            <el-input v-model="newPwd" type="password" maxlength="20" placeholder="新密码" show-password />
        </el-row>

        <p></p>
        <el-row>
            <p>确认新密码</p>
            <el-input v-model="newPwd2" type="password" maxlength="20" placeholder="确认新密码" show-password />
        </el-row>
        <p></p>
        <el-button type="primary" style="position: relative; left: 440px; top: 20px" @click="pwdOk()">确定</el-button>
        <p></p>
    </el-dialog>
</template>

<script>
import { loginInfoStore } from '../store/loginInfo.js';
import { requestService } from "../request/request.js";
import { ElMessage } from "element-plus";

export default {
    name: "UserInfo",
    data() {
        return {
            loginInfoStore,
            username: loginInfoStore.data.user_name,
            questionNum: "0",
            correctRate: "0.0%",
            changePwd: false,
            pwd: "",
            newPwd: "",
            newPwd2: "",
        };
    },
    mounted() {
        var this_vue = this;
        requestService({
            url: "/user/getNum?userId=" + loginInfoStore.data.user_id,
            method: "get",
        }).then(function (response) {
            let res = response.data;
            console.log(res);
            this_vue.questionNum = res[0];
            this_vue.correctRate = res[1];
        })
    },
    methods: {
        pwdOk() {
            if (this.newPwd == "") ElMessage.error("密码不能为空");
            else if (this.newPwd != this.newPwd2) ElMessage.error("密码与确认密码不一致");
            else {
                let userId = loginInfoStore.data.user_id;
                var this_vue = this;
                requestService({
                    url: "/user/changePwd?userId=" + userId + "&pwd=" + this.pwd + "&newPwd=" + this.newPwd,
                    method: "get",
                }).then(function (response) {
                    let res = response.data;
                    console.log(res);
                    if (res == -1) ElMessage.error("原密码输入错误，拒绝执行");
                    else if (res == 0) ElMessage.error("修改失败");
                    else {
                        loginInfoStore.data.user_password = this_vue.pwd;
                        ElMessage.success("修改成功");
                        this_vue.changePwd = false;
                    }
                })
            }
        }
    },
}
</script>

<style scoped>
.read-the-docs {
    color: #888;
}

.box-card {
    width: 240px;
}
</style>