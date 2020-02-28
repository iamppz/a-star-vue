<template>
    <el-dialog title="选择用户" :visible.sync="visible" width="600px">
        <el-row>
            <el-col :span="7">
                <department-tree @click="handleDepartmentTreeClick"></department-tree>
            </el-col>
            <el-col :span="17">
                <div style="height: 300px; padding: 0 20px; overflow-y: auto;">
                    <div style="display: inline-block; margin: 6px; width: 100px; cursor: pointer"
                         v-for="user in users" :key="'option' + user.id"
                         @click="handleClickUser(user)">
                        <avatar size="small" style="cursor: pointer;">
                            {{user.name.substr(0, 1)}}
                        </avatar>
                        <span style="margin-left: 4px; line-height: 24px; display: inline-block; width: 72px; position: absolute; white-space: nowrap; overflow: hidden;">
                                {{user.name}}
                            </span>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div style="height: 72px; overflow-y: auto">
                <el-dropdown placement="bottom-start" trigger="click" @command="handleCommand"
                             v-for="user in selectedUsers"
                             style="margin: 6px;" :key="'selected-' + user.name">
                        <span class="el-dropdown-link">
                            <avatar size="small" style="cursor: pointer">
                                {{user.name.substr(0, 1)}}
                            </avatar>
                        </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="'remove-' + user.id">移除
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClickCancel">取消</el-button>
            <el-button type="primary">确定</el-button>
        </span>
    </el-dialog>
</template>
<script>
  import DepartmentTree from './DepartmentTree';
  import {Avatar} from 'ant-design-vue';
  import userService from '../service/userService';

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    data: function() {
      return {
        users: [],
        selectedUsers: [],
      };
    },
    components: {
      DepartmentTree, Avatar,
    },
    methods: {
      handleClickUser(user) {
        if (this.selectedUsers.indexOf(user) > -1) {
          return;
        }
        this.selectedUsers.push(user);
      },
      handleCommand(command) {
        let id = parseInt(command.split('-')[1]);
        let user = this.selectedUsers.filter(item => item.id === id)[0];
        let indexOf = this.selectedUsers.indexOf(user);
        this.selectedUsers.splice(indexOf, 1);
      },
      async handleDepartmentTreeClick(department) {
        let resp = await userService.getAllEnabledByDepartmentId(department.id);
        if (resp.data.success) {
          this.users = resp.data.data;
        }
      },
      handleClickCancel() {
        this.$emit('update:visible', false);
      },
    },
  };
</script>
