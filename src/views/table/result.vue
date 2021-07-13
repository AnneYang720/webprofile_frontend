<template>
  <div>
    <br>
    
    <el-form :inline="true" style="margin-left:5%;margin-top:2%">
      <el-form-item label="任务ID">
        <el-input v-model="taskId"></el-input>
      </el-form-item>
      <el-button @click="handleShow()" type="primary" plain>查看</el-button>
    </el-form>

    <el-table
      :data="tasksInfoList"
      :row-style="{height:0+'px'}"
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{padding:0+'px','text-align':'center'}"
      border
      style="width:90%;margin-left:5%">
      <el-table-column
        prop="taskInfo"
        label="TaskInfo">
      </el-table-column>
    </el-table>
    
  </div>
</template>
<script>

import taskApi from '@/api/task'

export default {
  data(){
      return {
        taskId: '', //用户输入的任务id
        tasksInfoList: []          
      }
  },
  methods: {
      handleShow(){
        if(this.taskId===''){
          this.$message.error('请输入任务ID')
          return false
        }
        taskApi.getTaskInfo(this.taskId).then(response =>{
          this.tasksInfoList = response.data
          console.log(this.tasksInfoList)
        }).catch(() => {
          this.taskInfo = ''
        });
      },
  },
  watch: {
    '$route': 'fetchTasksID'
  },
}
      
</script>

<style rel="stylesheet/scss" lang="scss">
.el-dialog {
  // // transform: translateY(-50%);
  // //border-radius: 10px;
  // // width: 500px;
  // // height: 500px!important;
  .el-dialog__header{  
    background: #f7f7f7;
    text-align: left;   
    font-weight: 600;
  }
}

</style>