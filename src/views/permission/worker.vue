<template>
  <div>
    <br>

    <el-table
      :data="workerList"
      :row-style="{height:40+'px'}"
      style="width:80%;margin-left:10%;margin-top:2%">

      <el-table-column
        prop="_id"
        label="硬件ID"
        min-width="30%">
        <template slot-scope="scope">
          <span style="color: DodgerBlue">{{ scope.row._id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="名称"
        min-width="20%">
      </el-table-column>

      <el-table-column
        prop="ip"
        label="IP地址"
        min-width="20%">
      </el-table-column>

      <el-table-column
        prop="platform"
        label="平台架构"
        min-width="20%">
      </el-table-column>

      <el-table-column
        prop="meg_version"
        label="MegEngine版本"
        min-width="25%">
      </el-table-column>

      <el-table-column
        prop="state"
        label="状态"
        min-width="15%">
      </el-table-column>

      <el-table-column
        prop="auth"
        label="权限"
        min-width="15%">
      </el-table-column>
      
    </el-table>
    

  </div>
</template>
<script>
import adminApi from '@/api/admin'
export default {
    data(){
        return {
          workerList: [], //首页用包名得到的列表
        }
    },
    created () {
        this.fetchworkersList()
    },
    methods: {
        fetchworkersList(){
            // console.log("fetch"+this.currentPage+' '+this.pageSize);
            adminApi.getWorkersList().then(response =>{
                this.workerList = response.data;
            }).catch((err) => {
                this.workerList = []
          });
        },

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
.el-table--enable-row-hover .el-table__body tr:hover>td{
	background-color: rgba(185,211,249,0.75);
}
</style>