<script setup>
import { Search, Plus, Back } from "@element-plus/icons-vue";
</script>
<template>
    <div style="text-align: center; margin-top: 80px;">
        <h1>题目管理</h1>
    </div>
    <el-container>
        <el-aside width="400px">
            <el-divider style="width: 300px;"></el-divider>
            <el-button :icon="Plus" style="position: relative; left: 80px" text @click="add = true; questionId = ''; subject = ''; knowledge = '';
            type = ''; from = ''; score = ''; level = '';">
                添加新题目
            </el-button>
            <el-divider style="width: 300px;"></el-divider>
            <div style="width: 300px;">
                <p>搜索</p>
                <el-input v-model="searchText" placeholder="在题目中搜索" class="input-with-select">
                    <template #prepend>
                        <el-select v-model="searchType" placeholder="Select" style="width: 115px">
                            <el-option label="编号" value="id" />
                            <el-option label="科目" value="subject" />
                            <el-option label="知识点" value="know" />
                            <el-option label="来源" value="from" />
                            <el-option label="内容" value="content" />
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
                    <p>科目</p>
                    <el-select v-model="filterSubject" placeholder="全部"
                        style="position: absolute; left: 100px; top: 10px; width: 200px;">
                        <el-option key="全部" label="全部" value="全部"></el-option>
                        <el-option v-for="item in subjects.slice(1)" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-row>
                <el-row>
                    <p>知识点</p>
                    <el-select v-model="filterKnowledge" placeholder="全部"
                        style="position: absolute; left: 100px; top: 10px; width: 200px;">
                        <el-option key="全部" label="全部" value="全部"></el-option>
                        <el-option v-for="item in filterSubject == '全部' ?
                            [] : (subjects.filter(i => { return i.value == filterSubject })[0].knowledge)"
                            :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-row>
                <el-row>
                    <p>题型</p>
                    <el-select v-model="filterType" placeholder="全部"
                        style="position: absolute; left: 100px; top: 10px; width: 200px;">
                        <el-option key="全部" label="全部" value="全部"></el-option>
                        <el-option v-for="item in questionTypes" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-row>
                <el-row>
                    <p>难度</p>
                    <el-select v-model="filterLevel" placeholder="全部"
                        style="position: absolute; left: 100px; top: 10px; width: 200px;">
                        <el-option key="全部" label="全部" value="全部"></el-option>
                        <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value" />
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
                        <el-table-column prop="question_id" label="编号" min-width="5%" show-overflow-tooltip="true" />
                        <el-table-column min-width="10%" show-overflow-tooltip="true" label="知识点">
                            <template #default="scope">
                                {{ scope.row.knowledge_name }}({{ scope.row.knowledge_id }})
                            </template>
                        </el-table-column>
                        <el-table-column min-width="10%" show-overflow-tooltip="true" label="科目">
                            <template #default="scope">
                                {{ scope.row.subject_name }}({{ scope.row.subject_id }})
                            </template>
                        </el-table-column>
                        <el-table-column min-width="5%" show-overflow-tooltip="true" label="题型">
                            <template #default="scope">
                                {{ scope.row.question_type == 1 ? '选择题' : '解答题' }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="question_from" label="来源" min-width="10%" show-overflow-tooltip="true" />
                        <el-table-column prop="question_score" label="分数" min-width="5%" show-overflow-tooltip="true" />
                        <el-table-column prop="question_level" label="难度" min-width="5%" show-overflow-tooltip="true" />
                        <el-table-column prop="question_description" label="描述" min-width="10%">
                            <template #default="scope">
                                <el-tooltip :content="scope.row.question_description" raw-content effect="light">
                                    <div class="inline-text">{{ scope.row.question_description }}</div>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column prop="question_answer" label="答案" min-width="10%">
                            <template #default="scope">
                                <el-tooltip :content="scope.row.question_answer" raw-content effect="light">
                                    <div class="inline-text">{{ scope.row.question_answer }}</div>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column prop="question_answer_detail" label="解析" min-width="10%">
                            <template #default="scope">
                                <el-tooltip :content="scope.row.question_answer_detail" raw-content effect="light">
                                    <div class="inline-text">{{ scope.row.question_answer_detail }}</div>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="110px;" show-overflow-tooltip="true" fixed="right">
                            <template #default="scope">
                                <el-button size="small" @click="
                                    change = true; handleEdit(scope.$index, scope.row);" icon="Edit" />
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
                            :total="questionStore.data.questions.length" style="position: relative; left: 20px"
                            :pre-click="(tableData = questionStore.data.questions.slice(page * 14 - 14, page * 14))"
                            :next-click="(tableData = questionStore.data.questions.slice(page * 14 - 14, page * 14))" />
                    </div>
                </el-main>
            </container>
        </el-main>
    </el-container>
    <el-dialog v-model="confirm" title="提示" width="30%" :before-close="handleClose">
        <p>确认要删除该题目吗？</p>
        <el-button type="primary" style="position: relative; left: 400px; top: 20px" @click="confirmDelete">确认</el-button>
        <el-button style="position: relative; left: 400px; top: 20px" @click="cancel">取消</el-button>
    </el-dialog>
    <el-dialog v-model="change" title="修改信息" width="50%" :before-close="handleClose">
        <el-row>
            <p>科目</p>
            <el-select v-model="subject" placeholder="科目" style="width: 400px; position: absolute; left: 100px; top: 10px">
                <el-option v-for="item in subjects.slice(1)" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-row>
        <el-row>
            <p>知识点</p>
            <el-select v-model="knowledge" placeholder="知识点"
                style="width: 400px; position: absolute; left: 100px; top: 10px">
                <el-option v-for="item in subjects.filter(i => { return i.value == subject })[0].knowledge"
                    :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-row>
        <el-row>
            <p>题型</p>
            <el-select v-model="type" placeholder="题型" style="width: 400px; position: absolute; left: 100px; top: 10px">
                <el-option v-for="item in questionTypes" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-row>
        <el-row>
            <p>来源</p>
            <el-input v-model="from" maxlength="20" placeholder="来源"
                style="width: 400px; position: absolute; left: 100px; top: 10px" />
        </el-row>
        <el-row>
            <p>分数</p>
            <el-input v-model="score" maxlength="20" placeholder="分数"
                style="width: 400px; position: absolute; left: 100px; top: 10px" />
        </el-row>
        <el-row>
            <p>难度</p>
            <el-select v-model="level" placeholder="难度" style="width: 400px; position: absolute; left: 100px; top: 10px">
                <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-row>
        <div style="min-height: 100px; position: relative;">
            <p>描述</p>
            <TextEditor ref="description" style="position: relative;" :spareId="'1'" />
        </div>
        <div style="min-height: 100px; position: relative;">
            <p>答案</p>
            <TextEditor ref="answer" style="position: relative;" :spareId="'2'" />
        </div>
        <div style="min-height: 100px; position: relative;">
            <p>解析</p>
            <TextEditor ref="answerDetail" style="position: relative;" :spareId="'3'" />
        </div>
        <el-button type="primary" style="position: relative; left: 440px; top: 20px" @click="confirmChange">确定</el-button>
    </el-dialog>
    <el-dialog v-model="add" title="添加题目" width="50%" :before-close="handleClose">
        <el-row>
            <p>科目</p>
            <el-select v-model="subject" placeholder="科目" style="width: 400px; position: absolute; left: 100px; top: 10px">
                <el-option v-for="item in subjects.slice(1)" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-row>
        <el-row>
            <p>知识点</p>
            <el-select v-model="knowledge" placeholder="知识点"
                style="width: 400px; position: absolute; left: 100px; top: 10px">
                <el-option v-for="item in subjects.filter(i => { return i.value == subject })[0].knowledge"
                    :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-row>
        <el-row>
            <p>题型</p>
            <el-select v-model="type" placeholder="题型" style="width: 400px; position: absolute; left: 100px; top: 10px">
                <el-option v-for="item in questionTypes" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-row>
        <el-row>
            <p>来源</p>
            <el-input v-model="from" maxlength="20" placeholder="来源"
                style="width: 400px; position: absolute; left: 100px; top: 10px" />
        </el-row>
        <el-row>
            <p>分数</p>
            <el-input v-model="score" maxlength="20" placeholder="分数"
                style="width: 400px; position: absolute; left: 100px; top: 10px" />
        </el-row>
        <el-row>
            <p>难度</p>
            <el-select v-model="level" placeholder="难度" style="width: 400px; position: absolute; left: 100px; top: 10px">
                <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-row>
        <div style="min-height: 100px; position: relative;">
            <p>描述</p>
            <TextEditor ref="description" style="position: relative;" :spareId="'1'" />
        </div>
        <div style="min-height: 100px; position: relative;">
            <p>答案</p>
            <TextEditor ref="answer" style="position: relative;" :spareId="'2'" />
        </div>
        <div style="min-height: 100px; position: relative;">
            <p>解析</p>
            <TextEditor ref="answerDetail" style="position: relative;" :spareId="'3'" />
        </div>
        <el-button type="primary" style="position: relative; left: 440px; top: 20px" @click="confirmAdd">确定</el-button>
    </el-dialog>
</template>

<script>
import { ElMessage } from 'element-plus';
import { requestService } from '../request/request';
import { questionStore } from '../store/questionStore';
import TextEditor from "./TextEditor.vue";
export default {
    name: "QuestionManage",
    components: { TextEditor },
    data() {
        return {
            questionStore,
            tableData: questionStore.data.questions,
            page: 1,
            confirm: false,
            change: false,
            add: false,
            searchText: "",
            searchType: "content",
            filterType: "全部",
            subjects: [
                { value: "", label: "", knowledge: [], },
            ],
            subject: "",
            subject_id: 0,
            knowledge: "",
            questionTypes: [
                { value: 1, label: "选择题" },
                { value: 2, label: "解答题" },
            ],
            type: "",
            from: "",
            score: "",
            levels: [
                { value: 1, label: "1" },
                { value: 2, label: "2" },
                { value: 3, label: "3" },
                { value: 4, label: "4" },
                { value: 5, label: "5" },
            ],
            level: "",
            questionId: "",
            filterSubject: "全部",
            filterKnowledge: "全部",
            filterType: "全部",
            filterLevel: "全部",
        };
    },
    created() {
        let this_vue = this;
        requestService({
            url: "/manage/getQuestions",
            method: "get",
        }).then(function (response) {
            let res = response.data;
            questionStore.data.questions = res;
            this_vue.tableData = questionStore.data.questions.slice(
                this_vue.page * 14 - 14,
                this_vue.page * 14
            );
            requestService({
                url: "/manage/getSubjects",
                method: "get",
            }).then(function (response) {
                let res = response.data;
                res.forEach(element => {
                    this_vue.subjects.push({ value: element.subject_id, label: element.subject_name, knowledge: [], });
                });
                requestService({
                    url: "/manage/getKnowledge",
                    method: "get",
                }).then(function (response) {
                    let res = response.data;
                    res.forEach(element => {
                        this_vue.subjects[element.subject_id].knowledge.push({ value: element.knowledge_id, label: element.knowledge_name });
                    })
                })
            })
        })
    },
    methods: {
        search() {
            if (this.searchType == "id") {
                questionStore.data.questions = questionStore.data.questions.filter(i => {
                    return i.question_id.includes(this.searchText);
                });
            } else if (this.searchType == "subject") {
                questionStore.data.questions = questionStore.data.questions.filter(i => {
                    return i.subject_name.includes(this.searchText);
                });
            } else if (this.searchType == "know") {
                questionStore.data.questions = questionStore.data.questions.filter(i => {
                    return i.knowledge_name.includes(this.searchText);
                });
            } else if (this.searchType == "from") {
                questionStore.data.questions = questionStore.data.questions.filter(i => {
                    return i.question_from.includes(this.searchText);
                });
            } else if (this.searchType == "content") {
                questionStore.data.questions = questionStore.data.questions.filter(i => {
                    return i.question_description.includes(this.searchText);
                });
            }
            this.page = 1;
            this.tableData = questionStore.data.questions.slice(this.page * 14 - 14, this.page * 14);
        },
        async back() {
            const response_1 = await requestService({
                url: "/manage/getQuestions",
                method: "get",
            });
            let res_1 = response_1.data;
            questionStore.data.questions = res_1;
            this.page = 1;
            this.tableData = questionStore.data.questions.slice(
                this.page * 14 - 14,
                this.page * 14
            );
        },
        handleEdit(index, row) {
            this.subject = row.subject_id;
            this.knowledge = row.knowledge_id;
            this.type = row.question_type;
            this.score = row.question_score;
            this.from = row.question_from;
            this.level = row.question_level;
        },
        handleDelete(index, row) {
            this.questionId = row.question_id;
        },
        async confirmChange() {
            let this_vue = this;
            var text1 = this.$refs["description"].htmlValue;
            var imgsUrl1 = this.$refs["description"].imgsUrl;
            imgsUrl1.forEach(element => {
                text1 += "<img src=\"../assets/pictures/upload/" + element.url + "\" />";
            });
            var text2 = this.$refs["answer"].htmlValue;
            var imgsUrl2 = this.$refs["answer"].imgsUrl;
            imgsUrl2.forEach(element => {
                text2 += "<img src=\"../assets/pictures/upload/" + element.url + "\" />";
            });
            var text3 = this.$refs["answerDetail"].htmlValue;
            var imgsUrl3 = this.$refs["answerDetail"].imgsUrl;
            imgsUrl3.forEach(element => {
                text3 += "<img src=\"../assets/pictures/upload/" + element.url + "\" />";
            });
            const response = await requestService({
                url: "/manage/updateQuestion",
                method: "get",
                params: {
                    questionId: this_vue.questionId,
                    knowledgeId: this_vue.knowledge,
                    type: this_vue.type,
                    score: this_vue.score,
                    from: this_vue.from,
                    level: this_vue.level,
                    description: text1,
                    answer: text2,
                    answerDetail: text3,
                },
            });
            let res = response.data;
            if (res == 0)
                ElMessage.error("修改失败");
            else {
                ElMessage.success("修改成功");
                this.change = false;
                const response_1 = await requestService({
                    url: "/manage/getQuestions",
                    method: "get",
                });
                let res_1 = response_1.data;
                questionStore.data.questions = res_1;
                this.tableData = questionStore.data.questions.slice(
                    this.page * 14 - 14,
                    this.page * 14
                );
            }
        },
        async confirmDelete() {
            let this_vue = this;
            const response = await requestService({
                url: "/manage/deleteQuestion?questionId=" + this_vue.questionId,
                method: "get",
            });
            let res = response.data;
            if (res <= 0) ElMessage.error("删除失败");
            else ElMessage.success("删除成功");
            this.confirm = false;
            const response_1 = await requestService({
                url: "/manage/getQuestions",
                method: "get",
            });
            let res_1 = response_1.data;
            questionStore.data.questions = res_1;
            this.tableData = questionStore.data.questions.slice(
                this.page * 14 - 14,
                this.page * 14
            );
        },
        async confirmAdd() {
            let this_vue = this;
            var text1 = this.$refs["description"].htmlValue;
            var imgsUrl1 = this.$refs["description"].imgsUrl;
            imgsUrl1.forEach(element => {
                text1 += "<img src=\"../assets/pictures/upload/" + element.url + "\" />";
            });
            var text2 = this.$refs["answer"].htmlValue;
            var imgsUrl2 = this.$refs["answer"].imgsUrl;
            imgsUrl2.forEach(element => {
                text2 += "<img src=\"../assets/pictures/upload/" + element.url + "\" />";
            });
            var text3 = this.$refs["answerDetail"].htmlValue;
            var imgsUrl3 = this.$refs["answerDetail"].imgsUrl;
            imgsUrl3.forEach(element => {
                text3 += "<img src=\"../assets/pictures/upload/" + element.url + "\" />";
            });
            const response = await requestService({
                url: "/manage/addQuestion",
                method: "get",
                params: {
                    knowledgeId: this_vue.knowledge,
                    type: this_vue.type,
                    score: this_vue.score,
                    from: this_vue.from,
                    level: this_vue.level,
                    description: text1,
                    answer: text2,
                    answerDetail: text3,
                }
            });
            let res = response.data;
            if (res == 0)
                ElMessage.error("添加失败");
            else {
                ElMessage.success("添加成功");
                this.add = false;
                const response_1 = await requestService({
                    url: "/manage/getQuestions",
                    method: "get",
                });
                let res_1 = response_1.data;
                questionStore.data.questions = res_1;
                this.tableData = questionStore.data.questions.slice(
                    this.page * 14 - 14,
                    this.page * 14
                );
            }
        },
        cancel() {
            this.confirm = false;
        },
        async confirmFilter() {
            this.page = 1;
            const response_1 = await requestService({
                url: "/manage/getQuestions",
                method: "get",
            });
            let res_1 = response_1.data;
            questionStore.data.users = res_1;
            console.log(this.filterType);
            if (this.filterSubject != "全部") {
                questionStore.data.questions = questionStore.data.questions.filter(i => {
                    return i.subject_id == this.filterSubject;
                });
            }
            if (this.filterKnowledge != "全部") {
                questionStore.data.questions = questionStore.data.questions.filter(i => {
                    return i.knowledge_id == this.filterKnowledge;
                });
            }
            if (this.filterType != "全部") {
                questionStore.data.questions = questionStore.data.questions.filter(i => {
                    return i.question_type == this.filterType;
                });
            }
            if (this.filterLevel != "全部") {
                questionStore.data.questions = questionStore.data.questions.filter(i => {
                    return i.question_level == this.filterLevel;
                });
            }
            this.tableData = questionStore.data.questions.slice(
                this.page * 14 - 14,
                this.page * 14
            );
        },
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

.inline-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
