<template>
    <el-container>
        <el-header>
            <el-menu :default-active="defaultActive" class="el-menu-demo" mode="horizontal" :ellipsis="false"
                style="width: 100%; border-right-width: 0px;" @select="handleSelect" router>
                <el-menu-item index="/homepage/questionBank" style="position: relative; left: 20px;">练习题库</el-menu-item>
                <el-menu-item index="/homepage/testing" style="position: relative; left: 20px;">组卷模拟</el-menu-item>
                <div style="flex-grow: 1;" />
                <el-sub-menu index="2" style="position: relative; right: 20px;"
                    v-show="loginInfoStore.data.user_type == '管理员'">
                    <template #title>系统管理</template>
                    <el-menu-item index="/homepage/userManage">用户管理</el-menu-item>
                    <el-menu-item index="/homepage/QuestionManage">题库管理</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="1" style="position: relative; right: 20px;">
                    <template #title>{{ username }}</template>
                    <el-menu-item index="/homepage/userInfo">个人中心</el-menu-item>
                    <el-menu-item index="/homepage/WrongQuestion">错题记录</el-menu-item>
                    <el-menu-item index="/homepage/questionCollect">题目收藏</el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-header>
        <el-main>
            <div id="mainPage"><router-view></router-view></div>
        </el-main>
    </el-container>
</template>

<script>
import { loginInfoStore } from '../store/loginInfo.js'

export default {
    name: "Homepage",
    data() {
        return {
            loginInfoStore,
            username: loginInfoStore.data.user_name,
            defaultActive: '/homepage/questionBank',
        };
    },
    created() {
        this.defaultActive = sessionStorage.getItem("keyPath") || "/homepage/questionBank";
    },
    watch: {
        defaultActive(newValue) {
            if (newValue != this.$route.path) {
                this.defaultActive = this.$route.path;
            }
        },
    },
    methods: {
        handleSelect(keyPath) {
            sessionStorage.setItem("keyPath", keyPath);
        },
    },
}
</script>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>
<style>
.el-menu--collapse .el-menu .el-submenu,
.el-menu--popup {
    min-width: fit-content !important;
}

.el-menu-item {
    background-color: white !important;
}

.el-menu-item.is-active {
    background-color: white !important;
}

.el-menu-item:hover {
    background-color: white !important;
}

.el-menu-demo {
    position: fixed;
}

#mainPage {
    margin: 20px;
}
</style>