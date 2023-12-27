<template>
    <div id="app"><router-view></router-view></div>
</template>

<script>
import { loginInfoStore } from './store/loginInfo';
export default {
    name: "App",
    created() {
        if (sessionStorage.getItem('loginInfo')) {
            loginInfoStore.data = JSON.parse(sessionStorage.getItem('loginInfo'));
        }
    },

}
</script>

<style scoped>
#app {
    margin: -8px;
}
</style>
