<template>
    <div style="background-color: #fafafa;">
        <van-tabs v-model="selected" type="line" sticky @click="switchTab" @load="getDynamicTab">
                <van-tab :title="tab.formName" :key="tab.uuid" v-for="tab in tabList">
                    <van-search shape="round" v-model="value" placeholder="请输入搜索关键词" show-action @search="onSearch"
                                @cancel="onSearch">
                        <div slot="action" @click="onSearch">搜索</div>
                    </van-search>
                    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                        <van-list v-model="loading" :finished="finished" @load="onLoad" finished-text="没有更多了">
                            <div v-for="form in list" class="card" :key="form.uuid" @click="openForm(form.uuid,form.workflowTemplateId)">
                                <table class="layout">
                                    <tr>
                                        <td class="avatar-box" rowspan="4">
                                            <img :src="avatarUrl + form.advisorIdavatar" class="avatar" alt="avatar">
                                            <p class="advisor">{{form.advisorIdname}}</p>
                                        </td>
                                        <td colspan="2" >
                                            <div class="header">
                                                <span class="title">{{form.serialNumber}}</span>
                                                <span class="status">{{form.amount}}</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" class="content">
                                            <p @click="customerDetail(form.customerId,$event)">
                                                <span class="iconfont icon-user"></span>
                                                <span>{{form.customerIdname || '无'}}</span>
                                            </p>
                                            <p>
                                                <span class="iconfont icon-date"></span>
                                                <span>{{form.createTime}}</span>
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </van-list>
                    </van-pull-refresh>
                </van-tab>
        </van-tabs>
    </div>
</template>

<script>
    import {Button, List, Panel, PullRefresh, Search, Tab, Tabs, Toast} from 'vant';
    import userInfo from '../store/userInfo';

    import formsService from "../service/formsService";
    import moment from "moment";
    import {formatMoney} from "../utils/money";
    import {formatDictionary} from "../utils/dictionary";
    import * as $ from "lodash";
    import {API_URL} from "../common/config";

    export default {
        data: function () {
            return {
                selected: 0,
                tabList: [],
                list: [],
                loading: false,
                finished: false,
                pageIndex: 0,
                amountField: "amount",
                tab: null,
                value: "",
                refreshing: false
            }
        },
        store: userInfo,
        components: {
            [Tab.name]: Tab,
            [Tabs.name]: Tabs,
            [Button.name]: Button,
            [Panel.name]: Panel,
            [List.name]: List,
            [Search.name]: Search,
            [PullRefresh.name]: PullRefresh
        },
        computed: {
            userId() {
                return this.$store.getters.getUserId;
            },
            avatarUrl() {
                return API_URL + "/oa/common/attachment/showImage?id=";
            }
        },
        created: async function () {
            let resp = await formsService.getTabList(this.$route.params.id);
            let hash = {};
            this.tabList = resp.data.Data.reduce(function (item, next) {
                if (hash[next['tableName']]) {
                    $.each(item, function (x, y) {
                        if (y.tableName === next.tableName) {
                            y.host = y.host + "," + next.host;
                        }
                    })
                } else {
                    hash[next['tableName']] = next.tableName;
                    item.push(next);
                }
                return item;
            }, []);
            this.tab = this.tabList[0];
        },
        methods: {
            async getDynamicTab() {
                Toast.success(this.value);
            },
            async onLoad() {
                this.pageIndex++;
                let resp = await formsService.getFormDataList(this.pageIndex, this.value, this.tab.tableName);
                resp.data.Data.data.forEach(form => {
                    form.createTime = moment(form.createTime).format('YYYY-MM-DD');
                    switch (this.tab.builtin) {
                        case "order":
                        case "receipt":
                        case "contract":
                            form.amount = formatMoney(form.amount);
                            break;
                        case "workorder":
                            form.amount = formatMoney(form.balance);
                            break;
                        default:
                            form.amount = formatMoney("");
                    }

                });
                formatDictionary(resp.data.Data.data, resp.data.Data.dictionary);
                this.loading = false;
                this.refreshing = false;
                this.list = [...this.list, ...resp.data.Data.data];
                this.finished = resp.data.Data.total <= this.list.length;
            },
            onSearch() {
                this.finished = false;
                this.loading = true;
                this.pageIndex = 0;
                this.list = [];
                this.onLoad();
            },
            openForm(id,workflowTemplate) {
                window.open('/wf/form/vsheet/form?workflowTemplateId='+workflowTemplate+'&id=' + id);
            },
            onRefresh() {
                this.finished = false;
                this.pageIndex = 0;
                this.list = [];
                this.onLoad();
            },
            switchTab(index) {
                window.scrollTo(0, 0);
                this.tab = this.tabList[index];
                this.onSearch();
            }
        }
    };
</script>

