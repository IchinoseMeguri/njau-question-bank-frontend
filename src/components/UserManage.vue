<script setup>
import { Search, Plus, Back } from "@element-plus/icons-vue";
</script>
<template>
    <div style="text-align: center; margin-top: 80px;">
        <h1>用户管理</h1>
    </div>
    <el-container>
        <el-aside width="400px">
            <el-divider style="width: 300px;"></el-divider>
            <el-button :icon="Plus" style="position: relative; left: 80px" text
                @click="add = true; userId = ''; type = ''; username = '';">
                添加新用户
            </el-button>
            <el-divider style="width: 300px;"></el-divider>
            <div style="width: 300px;">
                <p>搜索</p>
                <el-input v-model="searchText" placeholder="在用户中搜索" class="input-with-select">
                    <template #prepend>
                        <el-select v-model="searchType" placeholder="Select" style="width: 115px">
                            <el-option label="用户编号" value="type_userId" />
                            <el-option label="用户名" value="type_username" />
                        </el-select>
                    </template>
                    <template #append>
                        <el-button :icon="Search" @click="search" />
                    </template>
                </el-input>
            </div>
            <el-divider style="width: 300px;"></el-divider>
            <div style="width: 300px;">
                <p>筛选</p>
                <el-row>
                    <p>用户类型</p>
                    <el-select v-model="filterType" placeholder="全部"
                        style="position: absolute; left: 100px; top: 10px; width: 200px;">
                        <el-option key="全部" label="全部" value="全部"></el-option>
                        <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-row>
                <el-row>
                    <el-button type="primary" style="position: relative; left: 240px;" @click="confirmFilter">筛选</el-button>
                </el-row>
            </div>
            <el-divider style="width: 300px;"></el-divider>
            <el-button :icon="Back" style="position: relative; left: 165px;" @click="back">返回全部列表
            </el-button>
            <el-divider style="width: 300px;"></el-divider>
        </el-aside>
        <el-divider direction="vertical" style="height: 750px; position: fixed; left: 375px;"></el-divider>
        <el-main>
            <container style="position: fixed; left: 400px; right: 20px;">
                <el-header style="height: 610px;">
                    <el-table :data="tableData" empty-text="无数据" border style="width: 100%;">
                        <el-table-column prop="user_id" label="用户编号" min-width="15%" />
                        <el-table-column prop="user_name" label="用户名" min-width="20%" />
                        <el-table-column prop="user_type" label="用户类型" min-width="25%" />
                        <el-table-column label="操作" width="180px" fixed="right">
                            <template #default="scope">
                                <el-button size="small" @click="
                                    change = true; handleEdit(scope.$index, scope.row);" icon="Edit" />
                                <el-button size="small" type="primary" @click="
                                    changePwd = true; handlePwd(scope.$index, scope.row);" icon="RefreshRight" />
                                <el-button size="small" type="danger" @click="
                                    confirm = true; handleDelete(scope.$index, scope.row);" icon="Delete" />
                            </template>
                        </el-table-column>
                    </el-table>
                </el-header>
                <el-main>
                    <el-divider></el-divider>
                    <div style="display: flex">
                        <el-pagination v-model:current-page="page" layout="prev, pager, next" :page-size="14"
                            :total="userStore.data.users.length" style="position: relative; left: 20px"
                            :pre-click="(tableData = userStore.data.users.slice(page * 14 - 14, page * 14))"
                            :next-click="(tableData = userStore.data.users.slice(page * 14 - 14, page * 14))" />
                    </div>
                </el-main>
            </container>
        </el-main>
    </el-container>
    <el-dialog v-model="confirm" title="提示" width="30%" :before-close="handleClose">
        <p>确认要删除该用户吗？</p>
        <el-button type="primary" style="position: relative; left: 400px; top: 20px" @click="confirmDelete">确认</el-button>
        <el-button style="position: relative; left: 400px; top: 20px" @click="cancel">取消</el-button>
    </el-dialog>
    <el-dialog v-model="changePwd" title="提示" width="30%" :before-close="handleClose">
        <p>确认要重置该用户的密码吗？</p>
        <el-button type="primary" style="position: relative; left: 400px; top: 20px" @click="confirmPwd">确认</el-button>
        <el-button style="position: relative; left: 400px; top: 20px" @click="cancel">取消</el-button>
    </el-dialog>
    <el-dialog v-model="change" title="修改信息" width="30%" :before-close="handleClose">
        <el-row>
            <p>用户类型</p>
            <el-select v-model="type" placeholder="用户类型" style="width: 400px; position: absolute; left: 100px; top: 10px">
                <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-row>
        <el-row>
            <p>用户名</p>
            <el-input v-model="username" maxlength="20" placeholder="用户名"
                style="width: 400px; position: absolute; left: 100px; top: 10px" />
        </el-row>
        <el-button type="primary" style="position: relative; left: 440px; top: 20px" @click="confirmChange">确定</el-button>
    </el-dialog>
    <el-dialog v-model="add" title="添加用户" width="30%" :before-close="handleClose">
        <el-row>
            <p>用户类型</p>
            <el-select v-model="type" placeholder="用户类型" style="width: 400px; position: absolute; left: 100px; top: 10px">
                <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-row>
        <el-row>
            <p>用户名</p>
            <el-input v-model="username" maxlength="20" placeholder="用户名"
                style="width: 400px; position: absolute; left: 100px; top: 10px" />
        </el-row>
        <el-button type="primary" style="position: relative; left: 440px; top: 20px" @click="confirmAdd">确定</el-button>
    </el-dialog>
</template>

<script>
import { ElMessage } from 'element-plus';
import { requestService } from '../request/request';
import { userStore } from '../store/userStore';
export default {
    name: "UserManage",
    data() {
        return {
            userStore,
            tableData: userStore.data.users,
            page: 1,
            confirm: false,
            change: false,
            changePwd: false,
            add: false,
            types: [
                { value: "管理员", label: "管理员" },
                { value: "用户", label: "用户" },
            ],
            type: "",
            username: "",
            userId: "",
            searchText: "",
            searchType: "type_username",
            filterType: "全部",
        };
    },
    created() {
        let this_vue = this;
        requestService({
            url: "/manage/getUsers",
            method: "get",
        }).then(function (response) {
            let res = response.data;
            userStore.data.users = res;
            this_vue.tableData = userStore.data.users.slice(
                this_vue.page * 14 - 14,
                this_vue.page * 14
            );
        })
    },
    methods: {
        search() {
            if (this.searchType == "type_username") {
                userStore.data.users = userStore.data.users.filter(i => {
                    return i.user_name.includes(this.searchText);
                });
            } else {
                userStore.data.users = userStore.data.users.filter(i => {
                    return i.user_id.includes(this.searchText);
                });
            }
            this.page = 1;
            this.tableData = userStore.data.users.slice(this.page * 14 - 14, this.page * 14);
        },
        async back() {
            const response_1 = await requestService({
                url: "/manage/getUsers",
                method: "get",
            });
            let res_1 = response_1.data;
            userStore.data.users = res_1;
            this.page = 1;
            this.tableData = userStore.data.users.slice(
                this.page * 14 - 14,
                this.page * 14
            );
        },
        handleEdit(index, row) {
            this.userId = row.user_id;
            this.type = row.user_type;
            this.username = row.user_name;
        },
        handleDelete(index, row) {
            this.userId = row.user_id;
        },
        handlePwd(index, row) {
            this.userId = row.user_id;
        },
        async confirmChange() {
            let this_vue = this;
            const response = await requestService({
                url: "/manage/updateUser",
                method: "get",
                params: {
                    userId: this_vue.userId,
                    username: this_vue.username,
                    userType: this_vue.type,
                }
            });
            let res = response.data;
            if (res == -1)
                ElMessage.error("存在同名用户");
            else {
                if (res == 0)
                    ElMessage.error("修改失败");
                else {
                    ElMessage.success("修改成功");
                    this.change = false;
                    const response_1 = await requestService({
                        url: "/manage/getUsers",
                        method: "get",
                    });
                    let res_1 = response_1.data;
                    userStore.data.users = res_1;
                    this.tableData = userStore.data.users.slice(
                        this.page * 14 - 14,
                        this.page * 14
                    );
                }
            }
        },
        async confirmDelete() {
            let this_vue = this;
            const response = await requestService({
                url: "/manage/deleteUser?userId=" + this_vue.userId,
                method: "get",
            });
            let res = response.data;
            if (res <= 0) ElMessage.error("删除失败");
            else ElMessage.success("删除成功");
            this.confirm = false;
            const response_1 = await requestService({
                url: "/manage/getUsers",
                method: "get",
            });
            let res_1 = response_1.data;
            userStore.data.users = res_1;
            this.tableData = userStore.data.users.slice(
                this.page * 14 - 14,
                this.page * 14
            );
        },
        async confirmAdd() {
            let this_vue = this;
            const response = await requestService({
                url: "/manage/addUser",
                method: "get",
                params: {
                    username: this_vue.username,
                    userType: this_vue.type,
                }
            });
            let res = response.data;
            if (res == -1)
                ElMessage.error("存在同名用户");
            else {
                if (res == 0)
                    ElMessage.error("添加失败");
                else {
                    ElMessage.success("添加成功");
                    this.add = false;
                    const response_1 = await requestService({
                        url: "/manage/getUsers",
                        method: "get",
                    });
                    let res_1 = response_1.data;
                    userStore.data.users = res_1;
                    this.tableData = userStore.data.users.slice(
                        this.page * 14 - 14,
                        this.page * 14
                    );
                }
            }
        },
        async confirmPwd() {
            let this_vue = this;
            const response = await requestService({
                url: "/manage/resetPwd?userId=" + this_vue.userId,
                method: "get",
            });
            let res = response.data;
            this.changePwd = false;
            if (res <= 0) ElMessage.error("重置失败");
            else ElMessage.success("重置成功");
            const response_1 = await requestService({
                url: "/manage/getUsers",
                method: "get",
            });
            let res_1 = response_1.data;
            userStore.data.users = res_1;
            this.tableData = userStore.data.users.slice(
                this.page * 14 - 14,
                this.page * 14
            );
        },
        cancel() {
            this.confirm = false;
            this.changePwd = false;
        },
        async confirmFilter() {
            this.page = 1;
            const response_1 = await requestService({
                url: "/manage/getUsers",
                method: "get",
            });
            let res_1 = response_1.data;
            userStore.data.users = res_1;
            console.log(this.filterType);
            this.tableData = userStore.data.users.slice(
                this.page * 14 - 14,
                this.page * 14
            );
            if (this.filterType != "全部") {
                userStore.data.users = userStore.data.users.filter(i => {
                    return i.user_type == this.filterType;
                });
                this.tableData = userStore.data.users.slice(this.page * 14 - 14, this.page * 14);
            }
        }
    },
}
</script>

<style scoped>
.read-the-docs {
    color: #888;
}

.el-aside {
    height: 750px;
    position: fixed;
    overflow-y: auto;
    overflow-x: hidden;
}

.el-aside:hover {
    overflow-y: auto;
}

.el-aside::-webkit-scrollbar {
    width: 6px;
    height: 1px;
}

.el-aside::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #B3C0D1;
}

.el-aside::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #D3DCE6;
}
</style>
