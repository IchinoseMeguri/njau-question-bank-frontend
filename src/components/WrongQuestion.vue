<script setup>
import { Search, Star } from '@element-plus/icons-vue';
import TextEditor from './TextEditor.vue';
</script>
<template>
    <div style="text-align: center; margin-top: 80px;">
        <h1>错题记录</h1>
    </div>
    <el-container>
        <el-aside width="300px">
            <div>
                <el-menu :default-active="menuActive" class="el-menu-vertical-demo" @select="loadQuestion">
                    <div v-for="subject in knowledgeList">
                        <el-sub-menu :index="'' + subject.subject_id">
                            <template #title>
                                <h3>{{ subject.subject_name }}({{ subject.question_num }})</h3>
                            </template>
                            <div v-for="knowledge in subject.knowledge">
                                <el-menu-item :index="knowledge.knowledge_id">
                                    {{ knowledge.knowledge_name }}({{ knowledge.question_num }})
                                </el-menu-item>
                            </div>
                        </el-sub-menu>
                    </div>
                </el-menu>
            </div>
        </el-aside>
        <el-main>
            <el-container style="position: fixed; left: 350px;">
                <el-aside style="width: 1300px;">
                    <el-container>
                        <el-header style="position: fixed;">
                            <div style="display: flex; background-color: white;">
                                <el-button text size="large" :disabled="questionIndex == 0" @click="prevQuestion">
                                    <el-icon>
                                        <ArrowLeft />
                                    </el-icon>
                                    &nbsp上一题
                                </el-button>
                                <el-divider direction="vertical" style="height: 40px;" />
                                <el-button text size="large" :disabled="questionIndex >= questionList.length - 1"
                                    @click="nextQuestion">
                                    下一题&nbsp
                                    <el-icon>
                                        <ArrowRight />
                                    </el-icon>
                                </el-button>
                                <el-divider direction="vertical" style="height: 40px;" />
                                <el-input v-model="searchText" placeholder="在错题记录中搜索" :prefix-icon="Search"
                                    style="height: 40px; width: 500px; left: 20px;" />
                                <el-button type="primary" size="large" @click="searchQuestion"
                                    style="position: relative; left: 40px;">搜索</el-button>
                            </div>
                            <el-divider style="width: 1250px;" />
                        </el-header>
                        <el-main style="height: 750px; position: fixed; top: 300px; width: 1300px; height: 650px;">
                            <div style="position: relative;">
                                <div v-if="noData">
                                    <el-empty description="无数据" />
                                </div>
                                <div v-else>
                                    <div style="position: relative;">
                                        <el-button type="warning" :icon="Star" plain @click="noCollectQuestion"
                                            v-if="questionCollected">已收藏</el-button>
                                        <el-button type="warning" :icon="Star" @click="collectQuestion"
                                            v-else>收藏</el-button>
                                        <el-tag class="ml-2" type="success" size="large" disable-transitions
                                            style="position: relative; left: 20px;">{{
                                                question.index }}</el-tag>
                                        &nbsp;
                                        <el-tag class="ml-2" type="success" size="large" disable-transitions
                                            style="position: relative; left: 20px;">{{
                                                question.question_from
                                            }}</el-tag>
                                        &nbsp;
                                        <el-tag class="ml-2" type="success" size="large" disable-transitions
                                            style="position: relative; left: 20px;">{{
                                                question.question_type == 1 ? '选择题' : '解答题'
                                            }}</el-tag>
                                        &nbsp;
                                        <el-tag class="ml-2" type="success" size="large" disable-transitions
                                            style="position: relative; left: 20px;">{{
                                                question.question_score
                                            }}分</el-tag>
                                        &nbsp;
                                        <el-tag class="ml-2" type="success" size="large" disable-transitions
                                            style="position: relative; left: 20px;">难度系数：{{
                                                question.question_level
                                            }}</el-tag>
                                    </div>
                                    <div style="position: relative; top: 20px;">
                                        <div class="question-text" v-html="question.question_description"></div>
                                    </div>
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
                                                <p style="position: relative; left: 20px; top: -10px;">自我评分：</p>
                                                <el-input placeholder="0" v-model="doScore"
                                                    style="width: 50px; height: 30px; position: relative; left: 20px;">
                                                </el-input>
                                                <el-button type="primary" @click="handleReview"
                                                    style="position: relative; left: 40px;">提交</el-button>
                                            </div>
                                        </div>
                                        <p style="font-size: 10px;">&nbsp;</p>
                                    </div>
                                    <div v-if="questionCompleted" style="position: relative;">
                                        <p>【你的答案】</p>
                                        <div v-html="myAnswer"></div>
                                        <p v-if="myScore == question.question_score" style="color: green;">【得分】{{ myScore
                                        }}</p>
                                        <p v-else style="color: red;">【得分】{{ myScore }}</p>
                                    </div>
                                    <div style="position: relative;">
                                        <el-menu mode="horizontal" @select="AnswerComment">
                                            <el-menu-item style="position: relative; left: 20px;"
                                                index="questionAnswer">解析</el-menu-item>
                                            <el-menu-item style="position: relative; left: 20px;"
                                                index="questionComment">评论({{ commentNum }})</el-menu-item>
                                        </el-menu>
                                    </div>
                                    <div style="position: relative; top: 20px;" v-if="questionAnswer">
                                        <p>【答案】</p>
                                        <div v-html="question.question_answer"></div>
                                        <p>【解析】</p>
                                        <div v-html="question.question_answer_detail"></div>
                                    </div>
                                    <div style="position: relative; top: 20px;" v-if="questionComment">
                                        <div style="display: flex;">
                                            <el-input v-model="commentText" autosize type="textarea" placeholder="写评论"
                                                resize="none" style="width: 1000px; position: relative; top: 10px;" />
                                            <el-button type="primary" @click="doComment"
                                                style="position: relative; left: 20px; top: 10px;">发表</el-button>
                                        </div>
                                        <el-divider style="position: relative; top: 0px;" />
                                        <div v-if="commentList.length == 0" style="position: relative; top: 20px;">
                                            <el-empty description="无评论" />
                                        </div>
                                        <div v-else style="position: relative; top: 0px;">
                                            <div v-for="comment in commentList">
                                                <p style="font-size: 20px;">{{ comment.comment_user_name }}</p>
                                                <p style="font-size: 15px;">{{ comment.comment_content }}</p>
                                                <div style="display: flex;">
                                                    <p style="font-size: 15px; color: gray;">
                                                        {{ comment.comment_time[0] }}-{{ comment.comment_time[1] }}-{{
                                                            comment.comment_time[2] }}&nbsp;{{ comment.comment_time[3] }}:{{
        comment.comment_time[4] }}:{{ comment.comment_time[5] }}
                                                    </p>
                                                    <el-button type="info" text @click="doLike(comment.comment_id)"
                                                        style="position: relative; top: 7.5px; left: 20px;">赞({{
                                                            comment.comment_like }})
                                                    </el-button>
                                                    <el-button type="info" text @click="doDislike(comment.comment_id)"
                                                        style="position: relative; top: 7.5px;">踩({{ comment.comment_dislike
                                                        }})
                                                    </el-button>
                                                </div>
                                                <el-divider style="position: relative; top: 0px;" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-main>
                    </el-container>
                </el-aside>
                <el-main style="width: 300px; position: fixed; right: 0px; z-index: -1;" class="el-aside">
                    <el-divider direction="vertical" style="height: 750px; position: fixed; top: 200px;" />
                    <div style="position: relative; width: 240px; left: 20px;">
                        <p>&nbsp;&nbsp;答题卡</p>
                        <div v-for="question in questionList" v-if="cardDiv" class="card-display">
                            <el-button @click="cardClick(question.index)" style="width: 40px; margin: 10px;"
                                :type="cardType[question.index - 1]" :plain="questionIndex + 1 != question.index">{{
                                    question.index
                                }}</el-button>
                        </div>
                    </div>
                </el-main>
            </el-container>
        </el-main>
    </el-container>
    <el-dialog v-model="searchDialogue" title="搜索结果">
        <div v-if="searchList.length == 0" style="position: relative; top: 20px;">
            <el-empty description="无结果" />
        </div>
        <div v-else v-for="question in searchList" @click="searchToQuestion(question)">
            <el-divider style="margin-top: 1px; margin-bottom: 1px;"></el-divider>
            <div class="search-notice">
                <div>&nbsp;</div>
                <div>{{ question.subject_name }}&nbsp;>>&nbsp;{{ question.knowledge_name }}</div>
                <div>{{ question.question_description }}</div>
                <div>&nbsp;</div>
            </div>
        </div>
        <el-divider v-if="searchList.length > 0" style="margin-top: 1px; margin-bottom: 1px;"></el-divider>
    </el-dialog>
</template>

<script>
import { requestService } from '../request/request';
import { wrongStore } from '../store/wrong';
import { loginInfoStore } from '../store/loginInfo';
import { ElMessage } from "element-plus";

export default {
    name: "WrongQuestion",
    components: { TextEditor },
    data() {
        return {
            wrongStore,
            knowledgeList: wrongStore.data.subject,
            searchText: "",
            clickAType: "default",
            clickBType: "default",
            clickCType: "default",
            clickDType: "default",
            noData: true,
            questionList: [],
            question: {
                index: 0,
                question_id: "",
                knowledge_id: "",
                question_type: "",
                question_from: "",
                question_score: 0,
                question_description: "",
                question_answer: "",
                question_answer_detail: "",
            },
            questionIndex: 0,
            cardDiv: true,
            answerSelected: '',
            answerText: "",
            commentNum: 0,
            questionAnswer: false,
            questionComment: false,
            commentList: [],
            searchList: [],
            questionCollected: false,
            loginInfoStore,
            commentText: "",
            myAnswer: "",
            myScore: 0,
            questionCompleted: false,
            cardType: [],
            doScore: "",
            searchDialogue: false,
            menuActive: "",
        };
    },
    created() {
        var this_vue = this;
        requestService({
            url: "/wrong/getWrongList?userId=" + loginInfoStore.data.user_id,
            method: "get",
        }).then(function (response) {
            let res = response.data;
            wrongStore.data.subject = res;
            this_vue.knowledgeList = wrongStore.data.subject;
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
        handleOK() {
            if (this.answerSelected == '') ElMessage.info("未选择答案");
            else {
                let this_vue = this;
                requestService({
                    url: "/question/answerQuestionSelect?userId=" + loginInfoStore.data.user_id +
                        "&questionId=" + this_vue.question.question_id + "&answer=" + this_vue.answerSelected,
                    method: "get",
                }).then(function (response) {
                    let res = response.data;
                    this_vue.myAnswer = res;
                    this_vue.questionCompleted = true;
                    this_vue.myScore = res == this_vue.question.question_answer ? this_vue.question.question_score : 0;
                    this_vue.cardType[this_vue.question.index - 1] = res == this_vue.question.question_answer ? "success" : "danger";
                    if (res == this_vue.question.question_answer) ElMessage.success("回答正确");
                    else ElMessage.error("回答错误");
                })
            }
        },
        handleOKText() {
            var text = this.$refs["editorText"].htmlValue;
            var imgsUrl = this.$refs["editorText"].imgsUrl;
            imgsUrl.forEach(element => {
                text += "<img src=\"../assets/pictures/upload/" + element.url + "\" />";
            })
            let this_vue = this;
            requestService({
                url: "/question/answerQuestionText?userId=" + loginInfoStore.data.user_id +
                    "&questionId=" + this_vue.question.question_id,
                method: "get",
                params: { answer: text, },
            }).then(function (response) {
                let res = response.data;
                this_vue.myAnswer = res;
                this_vue.questionCompleted = true;
                this_vue.myScore = 0;
                this_vue.cardType[this_vue.question.index - 1] = "danger";
                ElMessage.success("答案已提交，你可以核对答案并进行自评");
            })
        },
        handleReview() {
            let score = 0;
            if ((/^[0-9]+$/.test(this.doScore)) == false) {
                ElMessage.error("分数不合法");
                return;
            }
            else {
                if (this.doScore == "") score = 0;
                else score = parseInt(this.doScore);
                if (score < 0 || score > this.question.question_score) {
                    ElMessage.error("分数不合法");
                    return;
                }
                else {
                    let this_vue = this;
                    return requestService({
                        url: "/question/submitScore?userId=" + loginInfoStore.data.user_id +
                            "&questionId=" + this_vue.question.question_id + "&score=" + score,
                        method: "get",
                    }).then(function (response) {
                        let res = response.data;
                        if (res == -1) {
                            ElMessage.error("未提交答案，无法评分");
                        } else {
                            this_vue.myScore = res;
                            this_vue.questionCompleted = true;
                            this_vue.cardType[this_vue.question.index - 1] = res == this_vue.question.question_score ? "success" : "danger";
                            ElMessage.success("提交成功");
                        }
                    })
                }
            }
        },
        searchQuestion() {
            if (this.searchText == "") {
                ElMessage.error("未输入搜索内容");
                return;
            }
            let this_vue = this;
            return requestService({
                url: "/wrong/search?userId=" + loginInfoStore.data.user_id,
                method: "get",
                params: { str: this_vue.searchText },
            }).then(function (response) {
                let res = response.data;
                this_vue.searchList = res;
                this_vue.searchDialogue = true;
            })
        },
        noCollectQuestion() {
            let this_vue = this;
            requestService({
                url: "/question/noCollect?userId=" + loginInfoStore.data.user_id + "&questionId=" + this_vue.question.question_id,
                method: "get",
            }).then(function (response) {
                let res = response.data;
                if (res) { this_vue.questionCollected = false; ElMessage.success("取消收藏成功"); }
            })
        },
        collectQuestion() {
            let this_vue = this;
            requestService({
                url: "/question/collect?userId=" + loginInfoStore.data.user_id + "&questionId=" + this_vue.question.question_id,
                method: "get",
            }).then(function (response) {
                let res = response.data;
                if (res) { this_vue.questionCollected = true; ElMessage.success("收藏成功"); }
            })
        },
        doComment() {
            let this_vue = this;
            requestService({
                url: "/comment/insertComment?userId=" + loginInfoStore.data.user_id +
                    "&questionId=" + this_vue.question.question_id + "&content=" + this_vue.commentText,
                method: "get",
            }).then(function (response) {
                let res = response.data;
                this_vue.commentList = res;
                this_vue.questionComment = true;
            })
        },
        doLike(commentId) {
            let this_vue = this;
            requestService({
                url: "/comment/like?commentId=" + commentId,
                method: "get",
            }).then(function (response) {
                let res = response.data;
                this_vue.commentList.some(element => {
                    if (element.comment_id == commentId) {
                        element.comment_like = res;
                    }
                    return element.comment_id == commentId;
                })
            })
        },
        doDislike(commentId) {
            let this_vue = this;
            requestService({
                url: "/comment/dislike?commentId=" + commentId,
                method: "get",
            }).then(function (response) {
                let res = response.data;
                this_vue.commentList.some(element => {
                    if (element.comment_id == commentId) {
                        element.comment_dislike = res;
                    }
                    return element.comment_id == commentId;
                })
            })
        },
        AnswerComment(index) {
            this.questionAnswer = false;
            this.questionComment = false;
            if (index == "questionAnswer") { this.questionAnswer = true; }
            else {
                let this_vue = this;
                requestService({
                    url: "/question/getComments?questionId=" + this_vue.question.question_id,
                    method: "get",
                }).then(function (response) {
                    let res = response.data;
                    this_vue.commentList = res;
                    this_vue.questionComment = true;
                })
            }
        },
        cardClick(index) {
            this.questionIndex = index - 1;
            this.question = this.questionList[this.questionIndex];
            this.questionAnswer = false;
            this.questionComment = false;
            if (this.question.question_type == 2) {
                this.$refs.editorText.htmlValue = "";
                this.$refs.editorText.imgsUrl = [];
            }
            let this_vue = this;
            requestService({
                url: "/question/getCommentNum?questionId=" + this_vue.question.question_id,
                method: "get",
            }).then(function (response) {
                this_vue.commentNum = response.data;
                requestService({
                    url: "/question/isCollected?userId=" + loginInfoStore.data.user_id + "&questionId=" + this_vue.question.question_id,
                    method: "get",
                }).then(function (response) {
                    this_vue.questionCollected = response.data;
                    requestService({
                        url: "/question/getUserAnswer?userId=" + loginInfoStore.data.user_id + "&questionId=" + this_vue.question.question_id,
                        method: "get",
                    }).then(function (response) {
                        let res = response.data;
                        this_vue.questionCompleted = res[0];
                        this_vue.myAnswer = res[1];
                        this_vue.myScore = res[2];
                    })
                })
            })
        },
        prevQuestion() {
            this.questionIndex--;
            this.question = this.questionList[this.questionIndex];
            this.questionAnswer = false;
            this.questionComment = false;
            if (this.question.question_type == 2) {
                this.$refs.editorText.htmlValue = "";
                this.$refs.editorText.imgsUrl = [];
            }
            let this_vue = this;
            requestService({
                url: "/question/getCommentNum?questionId=" + this_vue.question.question_id,
                method: "get",
            }).then(function (response) {
                this_vue.commentNum = response.data;
                requestService({
                    url: "/question/isCollected?userId=" + loginInfoStore.data.user_id + "&questionId=" + this_vue.question.question_id,
                    method: "get",
                }).then(function (response) {
                    this_vue.questionCollected = response.data;
                    requestService({
                        url: "/question/getUserAnswer?userId=" + loginInfoStore.data.user_id + "&questionId=" + this_vue.question.question_id,
                        method: "get",
                    }).then(function (response) {
                        let res = response.data;
                        this_vue.questionCompleted = res[0];
                        this_vue.myAnswer = res[1];
                        this_vue.myScore = res[2];
                    })
                })
            })
        },
        nextQuestion() {
            this.questionIndex++;
            this.question = this.questionList[this.questionIndex];
            this.questionAnswer = false;
            this.questionComment = false;
            if (this.question.question_type == 2) {
                this.$refs.editorText.htmlValue = "";
                this.$refs.editorText.imgsUrl = [];
            }
            let this_vue = this;
            requestService({
                url: "/question/getCommentNum?questionId=" + this_vue.question.question_id,
                method: "get",
            }).then(function (response) {
                this_vue.commentNum = response.data;
                requestService({
                    url: "/question/isCollected?userId=" + loginInfoStore.data.user_id + "&questionId=" + this_vue.question.question_id,
                    method: "get",
                }).then(function (response) {
                    this_vue.questionCollected = response.data;
                    requestService({
                        url: "/question/getUserAnswer?userId=" + loginInfoStore.data.user_id + "&questionId=" + this_vue.question.question_id,
                        method: "get",
                    }).then(function (response) {
                        let res = response.data;
                        this_vue.questionCompleted = res[0];
                        this_vue.myAnswer = res[1];
                        this_vue.myScore = res[2];
                    })
                })
            })
        },
        async loadQuestion(index) {
            var this_vue = this;
            var ks = [];
            this.knowledgeList.forEach(item => {
                item.knowledge.forEach(i => {
                    ks.push(i);
                });
            });
            var knowledge = ks.filter(item => {
                return item.knowledge_id == index;
            });
            let res = knowledge[0].questions;
            if (res.length > 0) {
                var i = 1;
                res.forEach(element => {
                    element.index = i++;
                });
                this.questionList = res;
                this.noData = false;
            }
            else {
                this.questionList = [];
                this.noData = true;
            }
            this_vue.questionIndex = 0;
            this_vue.question = this_vue.questionList[this_vue.questionIndex];
            this_vue.cardDiv = false;
            this_vue.cardDiv = true;
            this_vue.questionAnswer = false;
            this_vue.questionComment = false;
            if (this_vue.questionList.length > 0) {
                var questionIds = "";
                this_vue.questionList.forEach(element_1 => {
                    questionIds += element_1.question_id + ",";
                });
                return requestService({
                    url: "/question/getQuestionsState?userId=" + loginInfoStore.data.user_id,
                    method: "get",
                    params: { questionIds, },
                }).then(async function (response_1) {
                    let res_1 = response_1.data;
                    this_vue.cardType = res_1;
                    const response_2 = await requestService({
                        url: "/question/getCommentNum?questionId=" + this_vue.question.question_id,
                        method: "get",
                    });
                    this_vue.commentNum = response_2.data;
                    const response_3 = await requestService({
                        url: "/question/isCollected?userId=" + loginInfoStore.data.user_id + "&questionId=" + this_vue.question.question_id,
                        method: "get",
                    });
                    this_vue.questionCollected = response_3.data;
                    const response_4 = await requestService({
                        url: "/question/getUserAnswer?userId=" + loginInfoStore.data.user_id + "&questionId=" + this_vue.question.question_id,
                        method: "get",
                    });
                    let res_2 = response_4.data;
                    this_vue.questionCompleted = res_2[0];
                    this_vue.myAnswer = res_2[1];
                    this_vue.myScore = res_2[2];
                });
            }
        },
        async searchToQuestion(question) {
            let kId = question.knowledge_id;
            let qId = question.question_id;
            var this_vue = this;
            var ks = [];
            this.knowledgeList.forEach(item => {
                item.knowledge.forEach(i => {
                    ks.push(i);
                });
            });
            var knowledge = ks.filter(item => {
                return item.knowledge_id == kId;
            });
            let res = knowledge[0].questions;
            let qIndex = 0;
            if (res.length > 0) {
                var i = 1;
                res.forEach(element => {
                    if (element.question_id == qId) qIndex = i - 1;
                    element.index = i++;
                });
                this.questionList = res;
                this.noData = false;
            }
            else {
                this.questionList = [];
                this.noData = true;
            }
            this_vue.questionIndex = qIndex;
            this_vue.question = this_vue.questionList[this_vue.questionIndex];
            this_vue.cardDiv = false;
            this_vue.cardDiv = true;
            this_vue.questionAnswer = false;
            this_vue.questionComment = false;
            if (this_vue.questionList.length > 0) {
                var questionIds = "";
                this_vue.questionList.forEach(element_1 => {
                    questionIds += element_1.question_id + ",";
                });
                return requestService({
                    url: "/question/getQuestionsState?userId=" + loginInfoStore.data.user_id,
                    method: "get",
                    params: { questionIds, },
                }).then(async function (response_1) {
                    let res_1 = response_1.data;
                    this_vue.cardType = res_1;
                    const response_2 = await requestService({
                        url: "/question/getCommentNum?questionId=" + this_vue.question.question_id,
                        method: "get",
                    });
                    this_vue.commentNum = response_2.data;
                    const response_3 = await requestService({
                        url: "/question/isCollected?userId=" + loginInfoStore.data.user_id + "&questionId=" + this_vue.question.question_id,
                        method: "get",
                    });
                    this_vue.questionCollected = response_3.data;
                    const response_4 = await requestService({
                        url: "/question/getUserAnswer?userId=" + loginInfoStore.data.user_id + "&questionId=" + this_vue.question.question_id,
                        method: "get",
                    });
                    let res_2 = response_4.data;
                    this_vue.questionCompleted = res_2[0];
                    this_vue.myAnswer = res_2[1];
                    this_vue.myScore = res_2[2];
                    this_vue.searchDialogue = false;
                    this_vue.menuActive = kId;
                });
            }
        },
    },
}
</script>

<style scoped>
.read-the-docs {
    color: #888;
}

.el-menu-vertical-demo {
    position: fixed;
    width: 300px;
    height: 750px;
    overflow-y: auto;
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

.question-text {
    font-size: 20px;
    font-family: 'Times New Roman';
    line-height: 30px;
    white-space: pre;
}

.card-display {
    display: inline-flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: space-between;
}

.search-notice:hover {
    cursor: pointer;
}
</style>