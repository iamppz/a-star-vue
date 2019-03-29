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
                <el-aside v-if="isLoggedIn">
                    <el-menu default-active="2-1" id="menu">
                        <template v-for="nav in this.navs">
                            <el-submenu :index="nav.id">
                                <template slot="title">
                                    <span>{{nav.name}}</span>
                                </template>
                                <el-menu-item v-for="subNav in nav.navs" :index="nav.id + '-' + subNav.id">
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
                menu.style.height = 'auto';
                const clientHeight = document.body.clientHeight - 60;
                const menuHeight = menu.offsetHeight;
                if (menuHeight < clientHeight) {
                    menu.style.height = `${clientHeight}px`;
                }
            }
        },
        mounted() {
            if (!this.isLoggedIn) {
                router.push('/login');
            }

            if (this.isLoggedIn) {
                this.autoSetNavHeight();
            }
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