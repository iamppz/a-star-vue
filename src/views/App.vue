<template>
    <el-container>
        <el-header class="joyce-header">
            <div>
                <p class="joyce-title">JCloud</p>
                <div>
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            <a href="javascript:void(0)" class="joyce-user">
                                <span class="joyce-avatar"></span>
                                <span class="joyce-name">
                                    {{name}}
                                    <i class="el-icon-caret-bottom"></i>
                                </span>
                            </a>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="password">修改密码</el-dropdown-item>
                            <el-dropdown-item command="logout">注销</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </el-header>
        <el-container>
            <el-aside>
                <el-menu :default-active="this.$route.path" router id="menu">
                    <template v-for="nav in this.navs">
                        <el-submenu :index="nav.name" :key="nav.id">
                            <template slot="title">
                                <span>{{nav.name}}</span>
                            </template>
                            <el-menu-item v-for="subNav in nav.children" :key="subNav.id" :index="subNav.path">
                                {{subNav.name}}
                            </el-menu-item>
                        </el-submenu>
                    </template>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
                <el-dialog title="修改密码" :visible.sync="passwordDialogVisible" width="500px">
                    <el-form ref="passwordForm" :model="passwordForm" label-width="100px" :rules="passwordRules">
                        <el-form-item label="当前密码" prop="currentPassword">
                            <el-input v-model="passwordForm.currentPassword" type="password"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" prop="password">
                            <el-input v-model="passwordForm.password" type="password"></el-input>
                        </el-form-item>
                        <el-form-item label="重复新密码" prop="confirmPassword">
                            <el-input v-model="passwordForm.confirmPassword" type="password"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="passwordDialogVisisble = false">取消</el-button>
                        <el-button type="primary" @click="handleClickSavePassword">确定</el-button>
                    </span>
                </el-dialog>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    import {Message} from 'element-ui';
    import navService from '../service/navService';
    import userInfo from "../store/userInfo";
    import userService from "../service/userService";

    export default {
        data: function () {
            return {
                navs: [],
                name: '',
                passwordDialogVisible: false,
                passwordForm: {
                    currentPassword: '',
                    password: '',
                    confirmPassword: ''
                },
                passwordRules: {
                    password: [
                        {required: true, message: '请输入当前密码', trigger: 'blur'},
                        {min: 8, max: 64, message: '长度在 8 到 64 个字符', trigger: 'blur'}
                    ],
                    currentPassword: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 8, max: 64, message: '长度在 8 到 64 个字符', trigger: 'blur'}
                    ],
                    confirmPassword: [
                        {required: true, message: '请再次输入密码', trigger: 'blur'},
                        {min: 8, max: 64, message: '长度在 8 到 64 个字符', trigger: 'blur'},
                        {
                            validator: (rule, value, callback) => {
                                if (value !== this.passwordForm.password) {
                                    callback(new Error('两次输入密码不一致!'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'
                        }
                    ]
                }
            }
        },
        store: userInfo,
        methods: {
            autoSetNavHeight() {
                const menu = document.getElementById('menu');
                const clientHeight = document.body.clientHeight - 60;
                if (menu.offsetHeight < clientHeight) {
                    menu.style.height = `${clientHeight}px`;
                }
            },
            logout() {
                localStorage.token = null;
                this.$router.push('/login');
            },
            handleCommand(cmd) {
                switch (cmd) {
                    case 'logout':
                        this.logout();
                        break;
                    case 'password':
                        this.passwordDialogVisible = true;
                        this.passwordForm = {
                            currentPassword: '',
                            password: '',
                            confirmPassword: ''
                        };
                        break;
                }
            },
            handleClickSavePassword() {
                this.$refs['passwordForm'].validate(async valid => {
                    if (valid) {
                        let resp = await userService.changePassword(this.passwordForm);
                        if (resp.data.success) {
                            Message.success("操作成功，请使用新密码重新登录");
                            this.passwordDialogVisible = false;
                            this.logout();
                        } else {
                            Message.error(resp.data.message);
                        }
                    } else {
                        return false;
                    }
                });

            }
        },
        async mounted() {
            this.autoSetNavHeight();
            let resp = await navService.getUserCategories();
            if (resp.data.success) {
                this.navs = resp.data.data;
            }

            resp = await userService.get();
            if (resp.data.success) {
                this.name = resp.data.data.name;
            }
        }
    };
</script>
<style scoped>
    #menu {
        height: auto;
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

    .joyce-user {
        text-decoration-line: none;
        display: inline-flex;
        color: black;
    }

    .joyce-avatar {
        border-radius: 50%;
        border: 1px solid #e6e6e6;
        width: 32px;
        height: 32px;
        background-size: 32px;
        display: inline-block;
        background-image: url('../assets/inno.jpg');
    }

    .joyce-name {
        line-height: 32px;
        display: inline-block;
        margin-left: 5px;
    }
</style>