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
                        <div v-for="(plan,index) in list" class="card" :key="plan.uuid" @click="openForm(plan.orderId,plan.workflowTemplate)">
                            <table class="layout">
                                <tr>
                                    <td class="avatar-box" rowspan="4">
                                        <img :src="avatarUrl + plan.advisorIdavatar" class="avatar" alt="avatar">
                                        <p class="advisor">{{plan.advisorIdname}}</p>
                                    </td>
                                    <td colspan="2" >
                                        <div class="header">
                                            <span class="title">{{plan.serialNumber}}</span>
                                            <span class="status">{{plan.planReceiptAmount}}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" class="content">
                                        <p @click="customerDetail(plan.customerId,$event)">
                                            <span class="iconfont icon-user"></span>
                                            <span>{{plan.customerIdname || '无'}}</span>
                                        </p>
                                        <p>
                                            <span class="iconfont icon-date"></span>
                                            <span>{{plan.planReceiptDate}}</span>
                                        </p>
                                        <p>
                                            <span class="iconfont icon-beizhu"></span>
                                            <span>{{plan.remark}}</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span class="icon iconfont icon-call" v-if="userId === plan.advisorId" @click="call(plan.mobile,$event)"></span>
                                        <span class="icon iconfont icon-success-o" v-if="userId === plan.advisorId" @click="setReceived(plan,index, $event)"></span>
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
                        <div v-for="(plan,index) in list" class="card" :key="plan.uuid" @click="openForm(plan.orderId,plan.workflowTemplate)">
                            <table class="layout">
                                <tr>
                                    <td class="avatar-box" rowspan="4">
                                        <img :src="avatarUrl + plan.advisorIdavatar" class="avatar" alt="avatar">
                                        <p class="advisor">{{plan.advisorIdname}}</p>
                                    </td>
                                    <td colspan="2">
                                        <div class="header">
                                            <span class="title">{{plan.serialNumber}}</span>
                                            <span class="status">{{plan.planReceiptAmount}}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" class="content">
                                        <p @click="customerDetail(plan.customerId,$event)">
                                            <span class="iconfont icon-user"></span>
                                            <span>{{plan.customerIdname || '无'}}</span>
                                        </p>
                                        <p>
                                            <span class="iconfont icon-date"></span>
                                            <span>{{plan.planReceiptDate}}</span>
                                        </p>
                                        <p>
                                            <span class="iconfont icon-beizhu"></span>
                                            <span>{{plan.remark}}</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span class="icon iconfont icon-call" v-if="userId === plan.advisorId" @click="call(plan.mobile,$event)"></span>
                                        <span class="icon iconfont icon-success-o" v-if="userId === plan.advisorId" @click="setReceived(plan,index, $event)"></span>
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
                        <div v-for="plan in list" class="card" :key="plan.uuid" @click="openForm(plan.orderId,plan.workflowTemplate)">
                            <table class="layout">
                                <tr>
                                    <td class="avatar-box" rowspan="4">
                                        <img :src="avatarUrl + plan.advisorIdavatar" class="avatar" alt="avatar">
                                        <p class="advisor">{{plan.advisorIdname}}</p>
                                    </td>
                                    <td colspan="2">
                                        <div class="header">
                                            <span class="title">{{plan.serialNumber}}</span>
                                            <span class="status">{{plan.planReceiptAmount}}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" class="content">
                                        <p @click="customerDetail(plan.customerId,$event)">
                                            <span class="iconfont icon-user"></span>
                                            <span>{{plan.customerIdname || '无'}}</span>
                                        </p>
                                        <p>
                                            <span class="iconfont icon-date"></span>
                                            <span>{{plan.planReceiptDate}}</span>
                                        </p>
                                        <p>
                                            <span class="iconfont icon-beizhu"></span>
                                            <span>{{plan.remark}}</span>
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
    import userInfo from '../../store/userInfo';

    import receiptPlanService from "../../service/receiptPlanService";
    import moment from "moment";
    import {API_URL} from "../../common/config";

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
            async setReceived(plan, index,e) {
                e.stopPropagation();
                let resp = await receiptPlanService.setReceived(plan.uuid);
                if (resp.data.Status === '1') {
                    Toast.success('操作成功');
                    plan.isReceived = true;
                    this.list.splice(index, 1);
                } else {
                    Toast.fail('服务器异常');
                }
            },
            async onLoad() {
                this.pageIndex++;
                let resp = await receiptPlanService.getList(this.pageIndex, this.value, this.type);
                resp.data.Data.data.forEach(plan => {
                    plan.planReceiptDate = moment(plan.planReceiptDate).format('YYYY-MM-DD');
                    plan.remark = plan.remark || '暂无备注';
                });
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
                this.type = ["unReceived","overdue","isReceived"][index];
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

