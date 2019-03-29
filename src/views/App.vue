<template>
    <div>
        <el-container>
            <el-header class="inno-header">
                <div>
                    <p class="inno-title">
                        <img src="../assets/inno.jpg" alt="logo" class="inno-logo">
                        Joyce Innovations
                    </p>
                    <p class="inno-logout" v-if="this.isLoggedIn">
                        <a href="javascript:void(0)" @click="logout">注销</a>
                    </p>
                </div>
            </el-header>
            <el-container>
                <el-aside v-show="isLoggedIn">
                    <el-menu default-active="2-1" id="menu">
                        <template v-for="nav in this.navs">
                            <el-submenu :index="nav.id" :key="nav.id">
                                <template slot="title">
                                    <span>{{nav.name}}</span>
                                </template>
                                <el-menu-item v-for="subNav in nav.navs" :key="subNav.id"
                                              :index="nav.id + '-' + subNav.id">
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
    </div>
</template>
<script>
    import userInfo from "../store/userInfo";
    import router from "../utils/router";

    export default {
        data: function () {
            return {}
        },
        router,
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
                userInfo.commit('logout');
                localStorage.token = null;
                router.push('/login');
            }
        },
        mounted() {
            if (!this.isLoggedIn) {
                router.push('/login');
            }
            this.autoSetNavHeight();
        },
        computed: {
            isLoggedIn() {
                return this.$store.getters.getIsLoggedIn;
            },
            navs() {
                return this.$store.getters.getNavs;
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