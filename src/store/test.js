import { reactive } from 'vue'

let testStore = reactive({
    data: {
        test_id: "",
        test_user_id: "",
        test_time: [],
        test_score: 0,
        test_state: 0,
        questions: [],
    }
})

export { testStore }

/**
    question:{
        index:1,
        question_id:"",
        ...,
        question_state:'primary'|'default'|'success'|'danger'|'warning',
        my_answer:"",
        my_score:"",
    }
 */