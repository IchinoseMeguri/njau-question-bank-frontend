import { reactive } from 'vue'

let questionsStore = reactive({
    data: {
        noData: true,
        questions: [],
    }
})

export { questionsStore }

/**
 * question1:{
 *      index:0,
 *      question_id: "",
        knowledge_id: "",
        question_type: "",
        question_from: "",
        question_score:0,
        question_description: "",
        question_answer: "",
        question_answer_detail:"",
 * }
 */