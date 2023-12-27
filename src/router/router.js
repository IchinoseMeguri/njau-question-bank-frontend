import { createRouter, createWebHashHistory } from 'vue-router'

import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Homepage from '../components/Homepage.vue'
import QuestionBank from '../components/QuestionBank.vue'
import Testing from '../components/Testing.vue'
import UserInfo from '../components/UserInfo.vue'
import WrongQuestion from '../components/WrongQuestion.vue'
import QuestionCollect from '../components/QuestionCollect.vue'
import UserManage from '../components/UserManage.vue'
import QuestionManage from '../components/QuestionManage.vue'

const routes = [
    {
        path: '/login',
        component: Login
    }, {
        path: '/',
        redirect: '/login'
    }, {
        path: '/register',
        component: Register
    },
    {
        path: '/homepage',
        component: Homepage,
        redirect: '/homepage/questionBank',
        children: [
            {
                path: 'questionBank',
                component: QuestionBank
            }, {
                path: 'testing',
                component: Testing
            }, {
                path: 'userInfo',
                component: UserInfo
            }, {
                path: 'wrongQuestion',
                component: WrongQuestion
            }, {
                path: 'questionCollect',
                component: QuestionCollect
            }, {
                path: 'userManage',
                component: UserManage
            }, {
                path: 'questionManage',
                component: QuestionManage
            },
        ]
    },
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;
