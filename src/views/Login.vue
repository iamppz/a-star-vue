<template>
    <el-container id="container">
        <el-header class="joyce-header">
            <div>
                <p class="joyce-title">
                    JCloud
                </p>
                <p id="link">
                    <a href="mailto:zsl@joyceinnovations.com">Contact</a>
                    <a href="https://www.jianshu.com/u/f5527e87925e">Blog</a>
                </p>
            </div>
        </el-header>
        <el-container id="body">
            <el-main style="display: flex; flex-direction: row; align-items: center;">
                <div style="width: 1000px; display: flex; align-items: center; margin: auto;
                            justify-content: space-between; color: white;">
                    <div style="width: 530px;">
<!--                        <h1 style="font-size: 54px; margin: 0;">-->
<!--                            欢迎来到<br>JCloud 企业管理平台</h1>-->
<!--                        <p style="font-size: 24px; margin: 10px 0 0 0; line-height: 160%;">-->
<!--                            注册即可开始使用，亦可部署至私有环境，并进行个性需求的定制开发<br>-->
<!--                        </p>-->
<!--                        <p style="font-size: 24px; margin: 10px 0 0 0; line-height: 160%;">-->
<!--                            我们按天对数据进行备份，并提供全量导出，以保证您对数据的所有权-->
<!--                        </p>-->
                    </div>
                    <el-card style="width: 400px;" id="card">
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
                </div>
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

    #card {
        background: rgba(255, 255, 255, 0.9);
    }

    #link {
        color: #999;
    }

    #link > a {
        text-underline: none;
        text-decoration-line: none;
        color: inherit;
        padding-left: 30px;
    }

    #link > a:hover {
        color: #606266;
    }

    .joyce-header {
        padding: 0;
        border-bottom: 1px solid #e6e6e6;
    }

    .joyce-header > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
    }

    .joyce-title {
        font-size: 20px;
        display: flex;
        align-items: center;
        margin: 0;
        line-height: 59px;
    }
</style>