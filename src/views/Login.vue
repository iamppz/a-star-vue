<template>
    <div>
        <el-input v-model="account" placeholder="请输入用户名"></el-input>
        <el-input v-model="password" placeholder="请输入用户名" show-password></el-input>
        <el-button type="primary" @click="login">登录</el-button>
    </div>
</template>

<script>
    import loginService from "../service/loginService";

    export default {
        data: function () {
            return {
                account: '张敬轩',
                password: '000000'
            }
        },
        methods: {
            login: async function () {
                alert('logging in');
                // await loginService.login(this.enterprise, this.account, this.password);
            }
        }
    };
</script>
