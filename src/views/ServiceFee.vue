<template>
    <div style="background-color: #fafafa;">
        <van-tabs v-model="selected" type="line" sticky @click="switchTab">
            <van-tab title="未收">
                <van-search shape="round" v-model="value" placeholder="请输入搜索关键词" show-action @search="onSearch"
                            @cancel="onSearch">
                    <div slot="action" @click="onSearch">搜索</div>
                </van-search>
                <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                    <van-list v-model="loading" :finished="finished" @load="onLoad" finished-text="没有更多了">
                        <div v-for="(fee,index) in list" class="card" :key="fee.uuid" @click="openForm(fee.contractId,fee.workflowTemplate)">
                            <table class="layout">
                                <tr>
                                    <td class="avatar-box" rowspan="4">
                                        <img :src="avatarUrl + fee.creatorIdavatar" class="avatar" alt="avatar">
                                        <p class="advisor">{{fee.creatorIdname}}</p>
                                    </td>
                                    <td colspan="2" >
                                        <div class="header">
                                            <span class="title">{{fee.serialNumber}}</span>
                                            <span class="status">{{fee.amount}}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" class="content">
                                        <p @click="customerDetail(fee.customerId,$event)">
                                            <span class="iconfont icon-user"></span>
                                            <span>{{fee.customerIdname || '无'}}</span>
                                        </p>
                                        <p>
                                            <span class="iconfont icon-date"></span>
                                            <span>{{fee.receiveTime}}</span>
                                        </p>
                                        <p>
                                            <span class="iconfont icon-beizhu"></span>
                                            <span>{{fee.remark}}</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span class="icon iconfont icon-call" v-if="userId === fee.creatorId" @click="call(fee.mobile,$event)"></span>
                                        <span class="icon iconfont icon-success-o" v-if="userId === fee.creatorId" @click="setReceived(fee,index, $event)"></span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </van-list>
                </van-pull-refresh>
            </van-tab>
            <van-tab title="逾期未收">
                <van-search shape="round" v-model="value" placeholder="请输入搜索关键词" show-action @search="onSearch"
                            @cancel="onSearch">
                    <div slot="action" @click="onSearch">搜索</div>
                </van-search>
                <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                    <van-list v-model="loading" :finished="finished" @load="onLoad" finished-text="没有更多了">
                        <div v-for="(fee,index) in list" class="card" :key="fee.uuid"  @click="openForm(fee.contractId,fee.workflowTemplate)">
                            <table class="layout">
                                <tr>
                                    <td class="avatar-box" rowspan="4">
                                        <img :src="avatarUrl + fee.creatorIdavatar" class="avatar" alt="avatar">
                                        <p class="advisor">{{fee.creatorIdname}}</p>
                                    </td>
                                    <td colspan="2">
                                        <div class="header">
                                            <span class="title">{{fee.serialNumber}}</span>
                                            <span class="status">{{fee.amount}}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" class="content">
                                        <p @click="customerDetail(fee.customerId,$event)">
                                            <span class="iconfont icon-user"></span>
                                            <span>{{fee.customerIdname || '无'}}</span>
                                        </p>
                                        <p>
                                            <span class="iconfont icon-date"></span>
                                            <span>{{fee.receiveTime}}</span>
                                        </p>
                                        <p>
                                            <span class="iconfont icon-beizhu"></span>
                                            <span>{{fee.remark}}</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span class="icon iconfont icon-call" v-if="userId === fee.creatorId" @click="call(fee.mobile,$event)"></span>
                                        <span class="icon iconfont icon-success-o" v-if="userId === fee.creatorId" @click="setReceived(fee,index, $event)"></span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </van-list>
                </van-pull-refresh>
            </van-tab>
            <van-tab title="已收">
                <van-search shape="round" v-model="value" placeholder="请输入搜索关键词" show-action @search="onSearch"
                            @cancel="onSearch">
                    <div slot="action" @click="onSearch">搜索</div>
                </van-search>
                <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                    <van-list v-model="loading" :finished="finished" @load="onLoad" finished-text="没有更多了">
                        <div v-for="fee in list" class="card" :key="fee.uuid" @click="openForm(fee.contractId,fee.workflowTemplate)">
                            <table class="layout">
                                <tr>
                                    <td class="avatar-box" rowspan="4">
                                        <img :src="avatarUrl + fee.creatorIdavatar" class="avatar" alt="avatar">
                                        <p class="advisor">{{fee.creatorIdname}}</p>
                                    </td>
                                    <td colspan="2">
                                        <div class="header">
                                            <span class="title">{{fee.serialNumber}}</span>
                                            <span class="status">{{fee.amount}}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" class="content">
                                        <p @click="customerDetail(fee.customerId,$event)">
                                            <span class="iconfont icon-user"></span>
                                            <span>{{fee.customerIdname || '无'}}</span>
                                        </p>
                                        <p>
                                            <span class="iconfont icon-date"></span>
                                            <span>{{fee.receiveTime}}</span>
                                        </p>
                                        <p>
                                            <span class="iconfont icon-beizhu"></span>
                                            <span>{{fee.remark}}</span>
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
    import {Tab, Tabs, Panel, Button, List, Search, PullRefresh, Toast} from 'vant';
    import userInfo from '../store/userInfo';
    import serviceFeeService from "../service/serviceFeeService";
    import moment from "moment";
    import {formatMoney} from "../utils/money";
    import {formatDictionary} from "../utils/dictionary";
    import {API_URL} from "../common/config";

    export default {
        data: function () {
            return {
                selected: 0,
                list: [],
                loading: false,
                finished: false,
                pageIndex: 0,
                value: '',
                type: 2,
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
        created: function () {

        },
        methods: {
            async setReceived(fee, index,e) {
                e.stopPropagation();
                let resp = await serviceFeeService.setReceived(fee.uuid);
                if (resp.data.Status === '1') {
                    Toast.success('操作成功');
                    fee.isReceived = true;
                    this.list.splice(index, 1);
                } else {
                    Toast.fail('服务器异常');
                }
            },
            async onLoad() {
                this.pageIndex++;
                let resp = await serviceFeeService.getList(this.pageIndex, this.value, this.type);
                resp.data.Data.data.forEach(fee => {
                    fee.receiveTime = moment(fee.receiveTime).format('YYYY-MM-DD');
                    fee.amount = formatMoney(fee.amount);
                    fee.remark = fee.remark || '暂无备注';
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
            onRefresh() {
                this.finished = false;
                this.pageIndex = 0;
                this.list = [];
                this.onLoad();
            },
            switchTab(index) {
                window.scrollTo(0, 0);
                this.type = [2, 3, 1][index];
                this.onSearch();
            },
            call(phoneNumber,e) {
                e.stopPropagation();
                window.location.href = 'tel:' + phoneNumber;
            },
            openForm(id,workflowTemplate) {
                window.open('/wf/form/vsheet/form?workflowTemplateId='+workflowTemplate+'&id=' + id);
            },
            customerDetail(){

            }
        }
    };
</script>

<style scoped>
    .icon {
        margin-right: 0.5rem;
        color: #00C1C9;
    }

    .content {
        color: #969799;
    }

    .content .iconfont {
        font-size: 0.8rem;
        margin-right: 0.3rem;
    }

    .content p{
        margin: 0.5rem 0;
    }

    .card {
        background-color: white;
        border-radius: 0.15rem;
        margin-left: 0.6rem;
        margin-right: 0.6rem;
        padding: 0.6rem;
        margin-top: 0.6rem;
        box-shadow: 0 0.1rem 0.03rem -0.06rem #dfdfdf, 0 0.06rem 0.06rem 0 #dfdfdf, 0 0.03rem 0.16rem 0 #dfdfdf;
        font-size: 0.8rem;
    }

    .header {
        width: 100%;
        display: inline-flex;
        justify-content: space-between;
    }

    .title {
        font-size: 1rem;
    }

    .status {
        color: #00C1C9;
    }

    .avatar {
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
    }

    .avatar-box {
        text-align: center;
        width: 4rem;
    }

    .advisor {
        margin: 0;
        color: #969799;
    }

    .layout {
        width: 100%;
    }
</style>
