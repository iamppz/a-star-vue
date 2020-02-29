<template>
    <div>
        <el-dialog title="编辑" :visible.sync="visible" width="440px"
                   :before-close="handleClickCancelSaveNode">
            <el-form ref="form" :model="nodeForm" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="nodeForm.name"/>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="nodeForm.type" placeholder="请选择" style="width: 100%;">
                        <el-option :key="'node-type-' + item.id" :label="item.name" :value="item.id"
                                   v-for="item in [
                                       { name: '开始', id: 'start' },
                                       { name: '结束', id: 'end' },
                                       { name: '审批', id: 'operation' }
                                   ]"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审批人">
                    <div>
                        <template v-for="user in nodeForm.approvers">
                            <el-dropdown placement="bottom-start" trigger="click"
                                         :key="'user' + user.id" @command="handleCommand">
                                <span class="el-dropdown-link">
                                    <avatar size="small" style="cursor: pointer">
                                        {{user.name.substr(0, 1)}}
                                    </avatar>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :command="'remove-' + user.id">
                                        移除
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <el-button size="small" style="margin-left: 8px;" type="text"
                                   @click="userPickerVisible = true">
                            添加
                        </el-button>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClickCancelSaveNode">取消</el-button>
                <el-button type="primary" @click="handleClickSaveNode">确定</el-button>
            </span>
        </el-dialog>
        <user-picker :visible.sync="userPickerVisible" @select="handleUserPickerSelect"
                     :selected="approverIds">
        </user-picker>
    </div>
</template>
<script>
  import UserPicker from '../../UserPicker';
  import {Avatar} from 'ant-design-vue';

  export default {
    components: {UserPicker, Avatar},
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      node: {
        type: Object,
        default: null,
      },
    },
    data: function() {
      return {
        userPickerVisible: false,
        nodeForm: {name: null, id: null, type: null, approvers: []},
      };
    },
    methods: {
      handleClickSaveNode() {
        this.$emit('update:node', Object.assign(this.node, {
          name: this.nodeForm.name,
          type: this.nodeForm.type,
          approvers: this.nodeForm.approvers,
        }));
        this.$emit('update:visible', false);
      },
      handleClickCancelSaveNode() {
        this.$emit('update:visible', false);
      },
      handleUserPickerSelect(users) {
        this.nodeForm.approvers.splice(0, this.nodeForm.approvers.length);
        users.forEach(u => {
          this.nodeForm.approvers.push(u);
        });
        this.userPickerVisible = false;
      },
      handleCommand(cmd) {
        let id = parseInt(cmd.split('-')[1]);
        let user = this.nodeForm.approvers.filter(item => item.id === id)[0];
        let indexOf = this.nodeForm.approvers.indexOf(user);
        this.nodeForm.approvers.splice(indexOf, 1);
      },
    },
    watch: {
      node: {
        immediate: true,
        handler(val) {
          this.nodeForm.id = val.id;
          this.nodeForm.name = val.name;
          this.nodeForm.type = val.type;
          this.nodeForm.approvers.splice(0, this.nodeForm.approvers.length);
          val.approvers.forEach(item => {
            this.nodeForm.approvers.push(Object.assign({}, item));
          });
        },
      },
    },
    computed: {
      approverIds() {
        return this.nodeForm.approvers.map(item => item.id);
      },
    },
  };
</script>