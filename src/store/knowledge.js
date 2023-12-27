import { reactive } from 'vue'

let knowledgeStore = reactive({
    data: {
        subject: [],
    }
})
export { knowledgeStore }
/** 
subject: [
    {
        subject_id: 1,
        subject_name: "数据结构",
        question_num:2,
        knowledge: [
            {
                knowledge_id: "10001001",
                knowledge_name: "数据结构与算法的基本概念",
                question_num:1
            },
            {
                knowledge_id: "10001002",
                knowledge_name: "算法分析",
                question_num:1
            },
        ]
    },
    {
        subject_id: 2,
        subject_name: "计算机组成原理",
        question_num:1,
        knowledge: [
            {
                knowledge_id: "20001001",
                knowledge_name: "",
                question_num:1
            },
        ],
    }
]
*/