<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/app/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统设置</el-breadcrumb-item>
            <el-breadcrumb-item>字典管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-container>
            <el-aside style="width: 250px">
                <el-input placeholder="输入关键字进行过滤" v-model="filterText">
                </el-input>
                <el-tree :data="dictionaries" :props="{ children: 'children', label: 'name' }" node-key="id" id="tree"
                         :filter-node-method="filterTreeNode" ref="tree" @node-click="handleClickTreeNode">
                    <span slot-scope="{ node }">
                        {{ node.label }}
                    </span>
                </el-tree>
            </el-aside>
            <el-main>
                <el-table :data="dictionaryItems" style="width: 100%" border stripe>
                    <el-table-column prop="name" label="字典项"></el-table-column>
                    <el-table-column label="操作" width="125">
                        <template slot-scope="scope">
                            <el-button @click="handleClickEditDictionaryItem(scope.row)" type="text"
                                       size="small" icon="el-icon-edit-outline">
                                编辑
                            </el-button>
                            <el-button @click="handleClickDeleteDictionaryItem(scope.row)" type="text"
                                       size="small" icon="el-icon-delete">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div id="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="handleClickCreateDictionaryItem" size="small">
                        新建
                    </el-button>
                </div>
                <el-dialog title="添加字典项" :visible.sync="addDialogVisible" width="300px">
                    <el-input type="textarea" :rows="5" placeholder="请输入字典项(每行一个）" v-model="form.names">
                    </el-input>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="addDialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="handleClickAddDictionaryItem">确定</el-button>
                    </span>
                </el-dialog>
                <el-dialog title="编辑字典项" :visible.sync="editDialogVisible" width="300px">
                    <input type="hidden" v-model="editForm.id"/>
                    <el-input placeholder="请输入字典项" v-model="editForm.name"></el-input>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="editDialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="handleClickSaveDictionaryItem">确定</el-button>
                    </span>
                </el-dialog>
            </el-main>
        </el-container>
    </div>
</template>
<script>
    import dictionaryService from "../service/dictionaryService";
    import {Message} from 'element-ui';

    export default {
        data() {
            return {
                filterText: '',
                dictionaries: [],
                dictionaryItems: [],
                addDialogVisible: false,
                editDialogVisible: false,
                form: {
                    names: null
                },
                editForm: {
                    name: null,
                    id: null
                }
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        async mounted() {
            let resp = await dictionaryService.get();
            if (resp.data.success) {
                this.dictionaries = resp.data.data;
            } else {
                Message.error(resp.data.message);
            }

            if (this.dictionaries.length > 0) {
                this.$refs.tree.setCurrentNode(this.dictionaries[0]);
            }
        },
        methods: {
            filterTreeNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            async handleClickTreeNode(dictionary) {
                let resp = await dictionaryService.getItems(dictionary.name);
                if (resp.data.success) {
                    this.dictionaryItems = resp.data.data;
                } else {
                    Message.error(resp.data.message);
                }
            },
            handleClickCreateDictionaryItem() {
                this.form.names = null;
                this.addDialogVisible = true;
            },
            handleClickEditDictionaryItem(item) {
                this.editForm = item;
                this.editDialogVisible = true;
            },
            async handleClickDeleteDictionaryItem(item) {
                let resp = await dictionaryService.deleteItem(item.id);
                if (resp.data.success) {
                    Message.success(resp.data.message);
                } else {
                    Message.error(resp.data.message);
                }
            },
            async handleClickAddDictionaryItem() {
                let dictionaryId = this.$refs.tree.getCurrentKey();
                let resp = await dictionaryService.addItems(this.form.names.replace(/\n/g, ','), dictionaryId);
                if (resp.data.success) {
                    Message.success(resp.data.message);
                } else {
                    Message.error(resp.data.message);
                }
            },
            async handleClickSaveDictionaryItem() {
                let resp = await dictionaryService.saveItem(this.editForm);
                if (resp.data.success) {
                    Message.success(resp.data.message);
                } else {
                    Message.error(resp.data.message);
                }
            }
        }
    }
</script>
<style scoped>
    #tree, #toolbar {
        margin-top: 20px;
    }

    .el-aside {
        padding: 20px 0;
    }
</style>