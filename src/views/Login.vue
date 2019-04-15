<template>
    <el-container id="container">
        <el-header class="inno-header">
            <div>
                <p class="inno-title">
                    <img src="../assets/inno.png" alt="logo" class="inno-logo">
                    Joyce
                </p>
                <p id="link">
                    <a href="mailto:zsl@joyceinnovations.com">Contact</a>
                    <a href="https://www.jianshu.com/u/f5527e87925e">Blog</a>
                </p>
            </div>
        </el-header>
        <el-container id="body">
            <el-main style="display: flex; flex-direction: row; align-items: center;">
                <el-card style="width: 450px; margin: auto">
                    <el-form ref="form" :model="form" label-width="80px" label-position="top" :rules="rules">
                        <el-form-item label="用户名" prop="account">
                            <el-input v-model="form.account" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="login" :loading="submitting" autofocus
                                       style="width: 100%;">登录
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    import loginService from "../service/loginService";
    import {Message} from 'element-ui';

    export default {
        data: function () {
            return {
                form: {
                    account: 'joyce',
                    password: '00000000'
                },
                rules: {
                    account: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 8, max: 64, message: '长度在 8 到 64 个字符', trigger: 'blur'}
                    ]
                },
                submitting: false
            }
        },
        methods: {
            login: async function () {
                this.$refs['form'].validate(async (valid) => {
                    if (!valid) {
                        alert('error submit!!');
                        return false;
                    }

                    this.submitting = true;
                    let resp = await loginService.login(this.form.account, this.form.password);
                    this.submitting = false;
                    if (!resp.data.success) {
                        Message.error(resp.data.message);
                        return;
                    }

                    Message.success(resp.data.message);
                    this.$router.app.$emit('login');
                });
            }
        }
    };
</script>
<style scoped>
    #container {
        height: 100%;
    }

    #body {
        background-image: url("../assets/bg.jpg");
        background-size: cover;
    }

    #link {
        color: #999;
    }

    #link > a {
        text-underline: none;
        text-decoration-line: none;
        color: inherit;
        margin-right: 60px;
    }

    .inno-header {
        padding: 0;
        border-bottom: 1px solid #e6e6e6;
    }

    .inno-header > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
    }

    .inno-title {
        font-size: 20px;
        display: flex;
        align-items: center;
        margin: 0;
        line-height: 59px;
    }

    .inno-logo {
        height: 40px;
        margin-left: 10px;
        margin-right: 10px;
    }
</style>