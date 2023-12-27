import { reactive } from 'vue'

let userStore = reactive({
    data: {
        users: [],
    }
})

export { userStore }