<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/app/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统设置</el-breadcrumb-item>
            <el-breadcrumb-item>流程设置</el-breadcrumb-item>
        </el-breadcrumb>
        <el-table :data="formattedDefinitions" style="width: 100%" ref="table" border stripe
                  id="tblList" >
            <el-table-column prop="name" label="名称" min-width="120" width="120"/>
            <el-table-column prop="createdAt" label="创建时间" min-width="135" width="135"/>
            <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" size="small" icon="el-icon-edit-outline"
                               @click="handleEditClick(scope.row.id)">
                        编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
  import processService from '../../../service/processService';
  import moment from 'moment';

  export default {
    data() {
      return {
        definitions: [],
      };
    },
    async mounted() {
      let resp = await processService.getAllDefinitions();
      if (resp.data.success) {
        this.definitions = resp.data.data;
      }
    },
    computed: {
      formattedDefinitions() {
        return this.definitions.map(item => {
          item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm');
          return item;
        });
      },
    },
    methods: {
      handleEditClick(id) {
        this.$router.push(`/app/workflow/config/detail?id=${id}`);
      },
    },
  };
</script>
<style scoped>
    #tblList {
        margin-top: 20px;
    }
</style>