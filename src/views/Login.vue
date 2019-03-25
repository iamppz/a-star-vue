<template>
    <el-container>
        <el-header>
            <h1>Test</h1>
        </el-header>
        <el-main>
            <el-row type="flex" class="row-bg" justify="center" align="middle">
                <el-col :span="8"></el-col>
                <el-col :span="8">
                    <el-card class="box-card">
                        <el-form ref="form" :model="form" label-width="80px" label-position="top" :rules="rules">
                            <el-form-item label="用户名" prop="account">
                                <el-input v-model="form.account" placeholder="请输入用户名"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="login">登录</el-button>
                            </el-form-item>
                        </el-form>
                    </el-card>
                </el-col>
                <el-col :span="8"></el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
    import loginService from "../service/loginService";

    export default {
        data: function () {
            return {
                form: {
                    account: '张敬轩',
                    password: '000000'
                },
                rules: {
                    account: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 8, max: 64, message: '长度在 8 到 64 个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            login: async function () {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        alert('error submit!!');
                        return false;
                    }
                });
                // await loginService.login(this.enterprise, this.account, this.password);
            }
        }
    };
</script>
<style scoped>
</style>