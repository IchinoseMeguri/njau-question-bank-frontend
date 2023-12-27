<template>
    <div>
        <quill-editor class="quill-editor" ref="myQuillEditor" theme="snow" v-model:content="htmlValue"
            :options="editorOption" placeholder="请输入" contentType="html" />
        <el-upload :class="'avatar-uploader' + spareId" :action="articleImgUrl" :headers="headerObj" :show-file-list="false"
            accept="image/*" :on-success="uploadSuccess" :on-error="uploadError" :before-upload="beforeUpload"
            :http-request="uploadRequest">
        </el-upload>
        <div v-for="img in imgsUrl">
            <el-popover placement="top-start" title="图片预览" :width="200" trigger="hover">
                <template #reference>
                    <el-button class="m-2" text>{{ img.url }}</el-button>
                </template>
                <div><img :src="'../assets/pictures/upload/' + img.url" /></div>
            </el-popover>
        </div>
    </div>
</template>
 
<script>
import { onMounted, ref, toRaw } from 'vue';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { ElMessage } from 'element-plus';
import { requestService } from '../request/request';
export default {
    name: "TextEditor",
    props: ['spareId'],
    data() {
        return {
            htmlValue: "",
            imgsUrl: [],
            imgsIndex: 0,
            articleImgUrl: "/img/upload",
            imgUrl: "",
            headerObj: {},
            editorOption: {
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ header: 1 }, { header: 2 }],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        [{ script: 'sub' }, { script: 'super' }],
                        [{ indent: '-1' }, { indent: '+1' }],
                        [{ direction: 'rtl' }],
                        [{ header: [1, 2, 3, 4, 5, 6] }],
                        [{ color: [] }, { background: [] }],
                        [{ align: [] }],
                        ['image',]
                    ]
                },
            }
        };
    },
    setup(props) {
        const myQuillEditor = ref();
        onMounted(() => {
            let quill = toRaw(myQuillEditor.value).getQuill()
            if (myQuillEditor.value) {
                quill.getModule("toolbar").addHandler("image", imgHandler);
            }
        })
        const imgHandler = (state) => {
            if (state) {
                document.querySelector('.avatar-uploader' + props.spareId + ' input').click();
            }
        }
        return {
            myQuillEditor,
            imgHandler,
            props,
        }
    },
    methods: {
        uploadSuccess() {
            var path = "/usr/local/software/projects/question_bank/front/dist/assets/pictures/upload/";
            this.imgsUrl.push({ index: this.imgsIndex, url: this.imgUrl.replace(path, "") });
            ElMessage.success("图片插入成功");
        },
        uploadError() {
            ElMessage.error('图片插入失败')
        },
        beforeUpload() { console.log("before"); },
        async uploadRequest(data) {
            const response = await requestService({
                url: "/img/upload",
                method: "post",
                headers: { "Content-Type": "multipart/form-data" },
                data: data,
            });
            let res = response.data;
            this.imgUrl = res;
        },
    },
}
</script>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>
