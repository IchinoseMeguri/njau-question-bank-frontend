import { reactive } from 'vue'

let loginInfoStore = reactive({
    data: {
        user_id: 0,
        user_type: "",
        user_name: "",
        user_password: "",
    }
})

export { loginInfoStore }

/**
 *     data: {
        user_id: 0,
        user_type: "",
        user_name: "",
        user_password: "",
    }
 */