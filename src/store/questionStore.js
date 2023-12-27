import { reactive } from 'vue'

let questionStore = reactive({
    data: {
        questions: [],
    }
})

export { questionStore }