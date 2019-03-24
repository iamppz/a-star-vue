<template>
    <div>
        <van-field label="企业名称" placeholder="请输入企业名称" v-model="enterprise"></van-field>
        <van-field label="用户名" placeholder="请输入用户名" v-model="account"></van-field>
        <van-field label="密码" placeholder="请输入密码" type="password" v-model="password"></van-field>
        <van-button type="primary" size="large" @click="login">登录</van-button>
    </div>
</template>

<script>
    import {Field, Button, Toast} from 'vant';
    import loginService from "../service/loginService";

    export default {
        data: function () {
            return {
                enterprise: '测试内容',
                account: '张敬轩',
                password: '000000'
            }
        },
        components: {
            [Field.name]: Field,
            [Button.name]: Button
        },
        methods: {
            login: async function () {
                await loginService.login(this.enterprise, this.account, this.password);
                Toast.success('操作成功');
            }
        }
    };
</script>
