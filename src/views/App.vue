<template>
    <el-container>
        <el-header class="inno-header">
            <div>
                <p class="inno-title">
                    <img src="../assets/inno.jpg" alt="logo" class="inno-logo">
                    Joyce Innovations
                </p>
                <p class="inno-logout">
                    <a href="javascript:void(0)" @click="logout">注销</a>
                </p>
            </div>
        </el-header>
        <el-container>
            <el-aside>
                <el-menu :default-active="this.$route.path" router id="menu">
                    <el-menu-item index="/app/home">
                        首页
                    </el-menu-item>
                    <template v-for="nav in this.navs">
                        <el-submenu :index="nav.name" :key="nav.id">
                            <template slot="title">
                                <span>{{nav.name}}</span>
                            </template>
                            <el-menu-item v-for="subNav in nav.navs" :key="subNav.id"
                                          :index="subNav.path">
                                {{subNav.name}}
                            </el-menu-item>
                        </el-submenu>
                    </template>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    import navService from '../service/navService';
    import userInfo from "../store/userInfo";

    export default {
        data: function () {
            return {
                navs: []
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
            }
        },
        async mounted() {
            this.autoSetNavHeight();
            let resp = await navService.getNavs();
            if (resp.data.success) {
                this.navs = resp.data.data;
            }
        }
    };
</script>
<style scoped>
    #menu {
        height: auto;
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
        height: 50px;
    }

    .inno-logout {

    }
</style>