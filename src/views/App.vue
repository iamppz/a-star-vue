<template>
    <div>
        <el-container>
            <el-header class="inno-header">
                <p class="inno-title">
                    <img src="../assets/inno.jpg" alt="logo" class="inno-logo">
                    Joyce Innovations
                </p>
            </el-header>
            <el-container>
                <el-aside>
                    <el-menu default-active="2" id="menu">
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>导航一</span>
                            </template>
                            <el-menu-item-group>
                                <template slot="title">分组一</template>
                                <el-menu-item index="1-1">选项1</el-menu-item>
                                <el-menu-item index="1-2">选项2</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group title="分组2">
                                <el-menu-item index="1-3">选项3</el-menu-item>
                            </el-menu-item-group>
                            <el-submenu index="1-4">
                                <template slot="title">选项4</template>
                                <el-menu-item index="1-4-1">选项1</el-menu-item>
                            </el-submenu>
                        </el-submenu>
                        <el-menu-item index="2">
                            <i class="el-icon-menu"></i>
                            <span slot="title">导航二</span>
                        </el-menu-item>
                        <el-menu-item index="3" disabled>
                            <i class="el-icon-document"></i>
                            <span slot="title">导航三</span>
                        </el-menu-item>
                        <el-menu-item index="4">
                            <i class="el-icon-setting"></i>
                            <span slot="title">导航四</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>

        </el-container>
    </div>
</template>
<script>
    import Vue from 'vue/dist/vue.js';
    import Home from "./Home";
    import Login from "./Login";
    import VueRouter from 'vue-router';
    import userInfo from "../store/userInfo";

    Vue.use(VueRouter);

    const routes = [
        {path: '/', component: Login},
        {path: '/login', component: Login},
        {path: '/home', component: Home}
    ];

    const router = new VueRouter({
        routes
    });

    export default {
        data: function () {
            return {}
        },
        router,
        store: userInfo,
        methods: {
            autoSetNavHeight() {
                const menu = document.getElementById('menu');
                menu.style.height = 'auto';
                const clientHeight = document.body.clientHeight - 60;
                const menuHeight = menu.offsetHeight;
                if (menuHeight < clientHeight) {
                    menu.style.height = `${clientHeight}px`;
                }
            }
        },
        mounted() {
            this.autoSetNavHeight();
        }
    };
</script>
<style scoped>
    .inno-header {
        padding: 0;
    }

    .inno-title {
        font-size: 20px;
        display: flex;
        align-items: center;
        margin: 0;
        border-bottom: 1px solid #e6e6e6;
        line-height: 59px;
    }

    .inno-logo {
        height: 50px;
    }
</style>