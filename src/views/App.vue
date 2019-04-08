<template>
    <el-container>
        <el-header class="inno-header">
            <div>
                <p class="inno-title">Joyce</p>
                <div>
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            <a href="javascript:void(0)">
                                <span class="inno-avatar"></span>
                            </a>
                        </span>
                        <el-dropdown-menu slot="dropdown">
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
            },
            handleCommand(cmd) {
                switch (cmd) {
                    case 'logout':
                        this.logout();
                        break;
                }
            }
        },
        async mounted() {
            this.autoSetNavHeight();
            let resp = await navService.getCategories();
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
        padding: 0 20px;
    }

    .inno-title {
        font-size: 20px;
        display: flex;
        align-items: center;
        margin: 0;
        line-height: 59px;
    }

    .inno-avatar {
        border-radius: 50%;
        border: 1px solid #e6e6e6;
        width: 32px;
        height: 32px;
        background-size: 32px;
        display: block;
        background-image: url('../assets/inno.jpg');
    }
</style>