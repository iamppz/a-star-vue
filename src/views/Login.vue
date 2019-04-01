<template>
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
                        <el-button type="primary" @click="login" :loading="submitting">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-col>
        <el-col :span="8"></el-col>
    </el-row>
</template>

<script>
    import loginService from "../service/loginService";
    import {Message} from 'element-ui';
    import userInfo from "../store/userInfo";
    import router from '../router';

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
                    userInfo.commit('login');
                    this.$router.push('/home');
                });
            }
        },
        store: userInfo,
        mounted() {
            if (this.$store.getters.getIsLoggedIn) {
                router.push('/home');
            }
        }
    };
</script>
<style scoped>
</style>