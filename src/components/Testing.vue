<script setup>
import { Plus, Search, Warning } from "@element-plus/icons-vue";
</script >
<template>
    <div v-if="mainMenu" style="text-align: center;">
        <div style="text-align: center; margin-top: 80px;">
            <h1>组卷模拟</h1>
        </div>
        <div v-if="existNowDoingTest">
            <el-divider></el-divider>
            <el-button text :icon="Warning" @click="handleContinue" type="danger">你有正在进行的测试，点击返回测试</el-button>
        </div>
        <div v-else>
            <el-divider></el-divider>
            <el-button text :icon="Plus" @click="handleNew" type="primary">进行新的组卷模拟</el-button>
        </div>
        <el-divider></el-divider>
        <el-button text :icon="Search" @click="handleLooking">查看以往组卷模拟</el-button>
        <el-divider></el-divider>
    </div>
    <div v-else>
        <el-container style="width: 100%;">
            <el-aside width="250px" class="el-aside">
                <div>
                    <p>&nbsp;&nbsp;答题卡</p>
                    <div v-for="question in questionList" class="card-display">
                        <el-button @click="cardClick(question.index)" style="width: 40px; margin: 10px;"
                            :type="question.question_state" :plain="questionIndex != question.index">{{
                                question.index
                            }}</el-button>
                    </div>
                </div>
            </el-aside>
            <el-divider direction="vertical" style="height: 850px; position: fixed; left: 275px;"></el-divider>
            <el-main>
                <el-container style="position: fixed; left: 300px; width: 100%;">
                    <el-header style="position: fixed; width: 100%;">
                        <div style="display: flex; background-color: white;">
                            <el-button text size="large" :disabled="questionIndex == 1" @click="prevQuestion">
                                <el-icon>
                                    <ArrowLeft />
                                </el-icon>
                                &nbsp上一题
                            </el-button>
                            <el-divider direction="vertical" style="height: 40px;" />
                            <el-button text size="large" :disabled="questionIndex >= questionList.length"
                                @click="nextQuestion">
                                下一题&nbsp
                                <el-icon>
                                    <ArrowRight />
                                </el-icon>
                            </el-button>
                            <div v-if="testStore.data.test_state == 0" style="display: flex;">
                                <el-divider direction="vertical" style="height: 40px;" />
                                <div style="position: relative; left: 20px; top: 10px;">剩余时间：</div>
                                <div style="color: red; position: relative; left: 40px; top: 10px;">{{ leftTime }}</div>
                                <el-divider direction="vertical" style="height: 40px; position: relative; left: 60px;" />
                                <el-button size="large" type="danger" @click="handUp"
                                    style="position: relative; left: 80px;">交卷</el-button>
                            </div>
                            <div v-else>

                            </div>
                        </div>
                        <el-divider style="width: 100%;"></el-divider>
                    </el-header>
                    <el-main style="position: relative; top: 70px; height: 100%">
                        <div v-if="questionList.length == 0">
                            <el-empty description="无数据" />
                        </div>
                        <div v-else>
                            <div style="display: flex;">
                                <el-tag class="ml-2" type="success" size="large" disable-transitions
                                    style="position: relative; left: 0px;">{{
                                        question.index }}</el-tag>
                                &nbsp;
                                <el-tag class="ml-2" type="success" size="large" disable-transitions
                                    style="position: relative; left: 10px;">{{
                                        question.question_type == 1 ? '选择题' : '解答题'
                                    }}</el-tag>
                                &nbsp;
                                <el-tag class="ml-2" type="success" size="large" disable-transitions
                                    style="position: relative; left: 20px;">{{
                                        question.question_score
                                    }}分</el-tag>
                            </div>
                            <div style="position: relative; top: 20px;">
                                <div class="question-text" v-html="question.question_description"></div>
                            </div>
                            <div v-if="testStore.data.test_state == 0">
                                <div style="position: relative; top: 20px; height: 60px;"
                                    v-if="question.question_type == 1">
                                    <el-button @click="handleA" :type="clickAType">A</el-button>
                                    <el-button @click="handleB" :type="clickBType">B</el-button>
                                    <el-button @click="handleC" :type="clickCType">C</el-button>
                                    <el-button @click="handleD" :type="clickDType">D</el-button>
                                    <el-button type="primary" @click="handleOK">确认</el-button>
                                </div>
                                <div style="position: relative; top: 20px;" v-else>
                                    <div>
                                        <TextEditor ref="editorText" />
                                        <div style="display: flex;">
                                            <el-button type="primary" @click="handleOKText"
                                                style="position: relative;">确认</el-button>
                                        </div>
                                    </div>
                                    <p style="font-size: 10px;">&nbsp;</p>
                                </div>
                            </div>
                            <div v-if="question.question_state != 'default'" style="position: relative;">
                                <p>【你的答案】</p>
                                <div v-html="question.my_answer"></div>
                            </div>
                            <div
                                v-if="question.question_state == 'success' || question.question_state == 'danger' || question.question_state == 'warning'">
                                <p v-if="question.my_score == question.question_score" style="color: green;">【得分】{{
                                    question.my_score
                                }}</p>
                                <p v-else style="color: red;">【得分】{{ question.my_score }}</p>
                                <p>【答案】</p>
                                <div v-html="question.question_answer"></div>
                                <p>【解析】</p>
                                <div v-html="question.question_answer_detail"></div>
                            </div>
                        </div>
                    </el-main>
                </el-container>
            </el-main>
        </el-container>
    </div>
    <el-dialog v-model="lookingPreTests" title="以往组卷记录">
        <div v-if="preTests.length == 0" style="position: relative; top: 20px;">
            <el-empty description="无结果" />
        </div>
        <div v-else v-for="test in preTests" @click="searchToTest(test)">
            <el-divider style="margin-top: 1px; margin-bottom: 1px;"></el-divider>
            <div class="search-notice">
                <div>&nbsp;</div>
                <div>测试编号：{{ test.test_id }}</div>
                <div>测试时间：{{ test.test_time[0] }}-{{ test.test_time[1] }}-{{ test.test_time[2] }}&nbsp;{{ test.test_time[3]
                }}:{{ test.test_time[4] }}:{{ test.test_time[5] }}</div>
                <div>状态：{{ test.test_state == 0 ? '进行中' : '已完成' }}</div>
                <div>得分：{{ preScores[preTests.indexOf(test)] }}</div>
                <div>&nbsp;</div>
            </div>
        </div>
        <el-divider style="margin-top: 1px; margin-bottom: 1px;" v-if="preTests.length > 0"></el-divider>
    </el-dialog>
    <el-dialog v-model="noticeNew" title="注意" style="text-align: center;">
        <div>进行组卷模拟时</div>
        <div>&nbsp;</div>
        <div>将会按照408考纲题目数量生成试卷</div>
        <div>&nbsp;</div>
        <div>包含选择题40题与解答题7题</div>
        <div>&nbsp;</div>
        <div>考试时长为3个小时</div>
        <div>&nbsp;</div>
        <el-button type="primary" @click="noticeOK">确定</el-button>
    </el-dialog>
    <el-dialog v-model="handUpNotice" title="注意" style="text-align: center;" :close-on-click-modal="false"
        :close-on-press-escape="false" :show-close="false">
        <div>已成功交卷</div>
        <div>&nbsp;</div>
        <el-button type="primary" @click="returnToTop">返回首页</el-button>
    </el-dialog>
</template>

<script>
import { testStore } from "../store/test";
import TextEditor from "./TextEditor.vue";
import { requestService } from "../request/request";
import { loginInfoStore } from "../store/loginInfo";
import { ElMessage } from "element-plus";
export default {
    name: "Testing",
    components: { TextEditor },
    data() {
        return {
            mainMenu: true,
            existNowDoingTest: false,
            lookingPreTests: false,
            noticeNew: false,
            preTests: [],
            preScores: [],
            testStore,
            questionList: testStore.data.questions,
            question: {},
            leftTime: "3:00:00",
            questionIndex: 0,
            answerSelected: "",
            clickAType: "default",
            clickBType: "default",
            clickCType: "default",
            clickDType: "default",
            handUpNotice: false,
        };
    },
    created() {
        let this_vue = this;
        requestService({
            url: "/test/getTests?userId=" + loginInfoStore.data.user_id,
            method: "get",
        }).then(function (response) {
            let res = response.data;
            if (res[0] == true) {
                var time = new Date();
                var nowTime = [time.getFullYear(), time.getMonth() + 1, time.getDate(), time.getHours(), time.getMinutes(), time.getSeconds()];
                var startTime = res[1].test_time;
                var deltaTime = this_vue.getTimeDelta(startTime, nowTime);
                console.log(deltaTime);
                if (deltaTime[0] == 0 && deltaTime[1] == 0 && deltaTime[2] == 0 && deltaTime[3] < 3) {
                    this_vue.existNowDoingTest = true;
                    testStore.data.test_id = res[1].test_id;
                    testStore.data.test_user_id = res[1].test_uer_id;
                    testStore.data.test_time = res[1].test_time;
                    testStore.data.test_state = res[1].test_state;
                    testStore.data.questions = JSON.parse(JSON.parse(res[2]).questions);
                    this_vue.questionList = testStore.data.questions;
                    this_vue.questionIndex = 1
                    this_vue.question = this_vue.questionList[this_vue.questionIndex - 1];
                }
                else {
                    requestService({
                        url: "/test/handUp?testId=" + res[1].test_id,
                        method: "get",
                    }).then(response => {
                        this_vue.mainMenu = true;
                    });
                }
            }
        })
    },
    methods: {
        handleA() {
            this.answerSelected = 'A';
            this.clickAType = "success";
            this.clickBType = "default";
            this.clickCType = "default";
            this.clickDType = "default";
        },
        handleB() {
            this.answerSelected = 'B';
            this.clickBType = "success";
            this.clickAType = "default";
            this.clickCType = "default";
            this.clickDType = "default";
        },
        handleC() {
            this.answerSelected = 'C';
            this.clickCType = "success";
            this.clickBType = "default";
            this.clickAType = "default";
            this.clickDType = "default";
        },
        handleD() {
            this.answerSelected = 'D';
            this.clickDType = "success";
            this.clickBType = "default";
            this.clickCType = "default";
            this.clickAType = "default";
        },
        async handleOK() {
            if (this.answerSelected == '') ElMessage.info("未选择答案");
            let this_vue = this;
            const response = await requestService({
                url: "/test/answerSelect?testId=" + testStore.data.test_id + "&index=" + this_vue.questionIndex + "&answer=" + this_vue.answerSelected,
                method: "get",
            });
            let res = response.data;
            testStore.data.questions = JSON.parse(res.questions);
            this.questionList = testStore.data.questions;
            if (this.questionIndex < 47) {
                this.questionIndex++;
                this.question = this_vue.questionList[this.questionIndex - 1];
            }
            if (this.question.question_type == 2) {
                this.$refs.editorText.htmlValue = "";
                this.$refs.editorText.imgsUrl = [];
            }
            this.answerSelected = "";
            this.clickAType = "default";
            this.clickBType = "default";
            this.clickCType = "default";
            this.clickDType = "default";
        },
        async handleOKText() {
            var text = this.$refs["editorText"].htmlValue;
            var imgsUrl = this.$refs["editorText"].imgsUrl;
            imgsUrl.forEach(element => {
                text += "<img src=\"../assets/pictures/upload/" + element.url + "\" />";
            })
            let this_vue = this;
            const response = await requestService({
                url: "/test/answerWriting?testId=" + testStore.data.test_id + "&index=" + this_vue.questionIndex + "&answer=" + text,
                method: "get",
            });
            let res = response.data;
            testStore.data.questions = JSON.parse(res.questions);
            this.questionList = testStore.data.questions;
            if (this.questionIndex < 47) {
                this.questionIndex++;
                this.question = this_vue.questionList[this.questionIndex - 1];
            }
            if (this.question.question_type == 2) {
                this.$refs.editorText.htmlValue = "";
                this.$refs.editorText.imgsUrl = [];
            }
        },
        handleLooking() {
            this.lookingPreTests = true;
            let this_vue = this;
            requestService({
                url: "/test/getPreTests?userId=" + loginInfoStore.data.user_id,
                method: "get",
            }).then(function (response) {
                let res = response.data;
                this_vue.preTests = res[0];
                this_vue.preScores = res[1];
            })
        },
        handleNew() {
            this.noticeNew = true;
        },
        searchToTest(test) {
            this.mainMenu = false;
            let this_vue = this;
            requestService({
                url: "/test/getTest?testId=" + test.test_id,
                method: "get",
            }).then(response => {
                let res = response.data;
                testStore.data.test_id = res.test_id;
                testStore.data.test_user_id = res.test_user_id;
                testStore.data.test_state = res.test_state;
                testStore.data.test_time = res.test_time;
                testStore.data.test_score = res.test_score;
                testStore.data.questions = JSON.parse(res.questions);
                this_vue.questionList = testStore.data.questions;
                this_vue.questionIndex = 1;
                this_vue.question = this_vue.questionList[this_vue.questionIndex - 1];
                this_vue.lookingPreTests = false;
            })
        },
        async noticeOK() {
            let this_vue = this;
            const response = await requestService({
                url: "/test/newTest?userId=" + loginInfoStore.data.user_id,
                method: "get",
            });
            let res = response.data;
            testStore.data.test_id = res[0].test_id;
            testStore.data.test_user_id = res[0].test_user_id;
            testStore.data.test_state = res[0].test_state;
            testStore.data.test_time = res[0].test_time;
            testStore.data.questions = JSON.parse(JSON.parse(res[1]).questions);
            this_vue.questionList = testStore.data.questions;
            this_vue.questionIndex = 1;
            this_vue.question = this_vue.questionList[this_vue.questionIndex - 1];
            this_vue.noticeNew = false;
            this_vue.mainMenu = false;
            this.setTiming();
        },
        handleContinue() {
            this.mainMenu = false;
            this.questionIndex = 1;
            this.question = this.questionList[this.questionIndex - 1];
            this.setTiming();
        },
        prevQuestion() {
            this.questionIndex--;
            this.question = this.questionList[this.questionIndex - 1];
            this.answerSelected = "";
            this.clickAType = "default";
            this.clickBType = "default";
            this.clickCType = "default";
            this.clickDType = "default";
            if (this.question.question_type == 2) {
                this.$refs.editorText.htmlValue = "";
                this.$refs.editorText.imgsUrl = [];
            }
        },
        nextQuestion() {
            this.questionIndex++;
            this.question = this.questionList[this.questionIndex - 1];
            this.answerSelected = "";
            this.clickAType = "default";
            this.clickBType = "default";
            this.clickCType = "default";
            this.clickDType = "default";
            if (this.question.question_type == 2) {
                this.$refs.editorText.htmlValue = "";
                this.$refs.editorText.imgsUrl = [];
            }
        },
        cardClick(index) {
            this.questionIndex = index;
            this.question = this.questionList[this.questionIndex - 1];
            this.answerSelected = "";
            this.clickAType = "default";
            this.clickBType = "default";
            this.clickCType = "default";
            this.clickDType = "default";
            if (this.question.question_type == 2) {
                this.$refs.editorText.htmlValue = "";
                this.$refs.editorText.imgsUrl = [];
            }
        },
        handUp() {
            let this_vue = this;
            requestService({
                url: "/test/handUp?testId=" + testStore.data.test_id,
                method: "get",
            }).then(response => {
                let res = response.data;
                this_vue.handUpNotice = true;
            })
        },
        returnToTop() {
            this.existNowDoingTest = false;
            this.mainMenu = true;
            this.handUpNotice = false;
            let this_vue = this;
            requestService({
                url: "/test/getTests?userId=" + loginInfoStore.data.user_id,
                method: "get",
            }).then(function (response) {
                let res = response.data;
                if (res[0] == true) {
                    this_vue.existNowDoingTest = true;
                    testStore.data.test_id = res[1].test_id;
                    testStore.data.test_user_id = res[1].test_uer_id;
                    testStore.data.test_time = res[1].test_time;
                    testStore.data.test_state = res[1].test_state;
                    testStore.data.questions = JSON.parse(JSON.parse(res[2]).questions);
                    this_vue.questionList = testStore.data.questions;
                    this_vue.questionIndex = 1
                    this_vue.question = this_vue.questionList[this_vue.questionIndex - 1];
                }
            })
        },
        setTiming() {
            var startTime = testStore.data.test_time;
            var time = new Date();
            var nowTime = [time.getFullYear(), time.getMonth() + 1, time.getDate(), time.getHours(), time.getMinutes(), time.getSeconds()];
            var passedTime = this.getTimeDelta(startTime, nowTime);
            var leftTime = this.getTimeDelta(passedTime, [0, 0, 0, 3, 0, 0]);
            let timer = setInterval(() => {
                if (leftTime[3] <= 0 && leftTime[4] == 0 && leftTime[5] == 0) {
                    clearInterval(timer);
                    this.handUp();
                }
                else {
                    leftTime[5]--;
                    if (leftTime[5] < 0) {
                        leftTime[5] += 60; leftTime[4]--;
                    }
                    if (leftTime[4] < 0) {
                        leftTime[4] += 60; leftTime[3]--;
                    }
                    this.leftTime = "" + leftTime[3] + ":";
                    if (leftTime[4] < 10) this.leftTime += "0";
                    this.leftTime += leftTime[4] + ":";
                    if (leftTime[5] < 10) this.leftTime += "0";
                    this.leftTime += leftTime[5];
                }
            }, 1000)
        },
        getTimeDelta(start, end) {
            if (end[5] < start[5]) {
                end[5] += 60; end[4]--;
            }
            let second = end[5] - start[5];
            if (end[4] < start[4]) {
                end[4] += 60; end[3]--;
            }
            let minute = end[4] - start[4];
            if (end[3] < start[3]) {
                end[3] += 24; end[2]--;
            }
            let hour = end[3] - start[3];
            if (end[2] < start[2]) {
                end[2] += 31; end[1]--;
            }
            let date = end[2] - start[2];
            if (end[1] < start[1]) {
                end[1] += 12; end[0]--;
            }
            let month = end[1] - start[1];
            let year = end[0] - start[0];
            return [year, month, date, hour, minute, second];
        },
    },
}
</script>

<style scoped>
.read-the-docs {
    color: #888;
}

.search-notice:hover {
    cursor: pointer;
}

.question-text {
    font-size: 20px;
    font-family: 'Times New Roman';
    line-height: 30px;
    white-space: pre;
}

.el-aside {
    height: 850px;
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

.card-display {
    display: inline-flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: space-between;
}
</style>