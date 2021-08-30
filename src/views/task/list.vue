<template>
  <div>
    <br>

    <el-table
      :data="tasksList"
      :row-style="{height:40+'px'}"
      style="width:90%;margin-left:5%;margin-top:2%">

      <el-table-column
        prop="_id"
        label="任务ID"
        min-width="30%">
        <template slot-scope="scope">
          <span style="color: DodgerBlue">{{ scope.row._id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="mge_name"
        label="MGE模型"
        min-width="18%">
      </el-table-column>

      <el-table-column
        prop="data_name"
        label="数据DATA"
        min-width="18%">
      </el-table-column>

      <el-table-column
        prop="worker"
        label="worker"
        min-width="15%">
      </el-table-column>

      <el-table-column
        prop="version"
        label="版本"
        min-width="10%">
      </el-table-column>

      <el-table-column
        prop="updateTime"
        label="更新时间"
        :formatter="formatDate"
        min-width="20%">
      </el-table-column>

      <el-table-column
        prop="state"
        label="任务状态"
        min-width="15%">
      </el-table-column>

      <el-table-column
        label="结果"
        min-width="6%">
        <template slot-scope="scope">
          <el-button @click.native.stop="toResult(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>

      <el-table-column
        label="模型"
        min-width="6%">
        <template slot-scope="scope">
          <el-button @click.native.stop="toChart(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
      
    </el-table>
    
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      align="center"
      style="margin-top:3%">
    </el-pagination>

    <!-- 弹出窗口 -->
    <el-dialog
      title="任务日志" 
      :visible.sync="dialogVisible"
      width="60%"
      >
      <div> {{this.failInfo}} </div>
    </el-dialog>


  </div>



</template>
<script>
import taskApi from '@/api/task'
import axios from 'axios'
export default {
    data(){
        return {
          tasksList: [], //首页用包名得到的列表
          total:  0, //总条数
          currentPage: 1, //当前页数
          pageSize: 10, //每页条数
          dialogVisible: false,
          failInfo: '',
        }
    },
    created () {
        this.fetchTasksList()
    },
    methods: {
        fetchTasksList(){
            // console.log("fetch"+this.currentPage+' '+this.pageSize);
            taskApi.getTasksList(this.currentPage,this.pageSize).then(response =>{
                this.total = response.data.total;
                // console.log("success "+this.total);
                this.tasksList = response.data.rows;
            }).catch((err) => {
                // console.log(err)
                this.total = 0
                // console.log("fail "+this.total)
                this.tasksList = []
          });
        },
        handleSizeChange(val) {
          this.pageSize = val;
          this.fetchTasksList();
        },
        handleCurrentChange(val) {
          this.currentPage = val;
          this.fetchTasksList();
        },
        formatDate(row, column) {
          let data = row[column.property]
          let dt = new Date(data)
          // console.log(dt)
          return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes()
        },

        toChart(row){
          this.$router.push({
            path:'/task/chart',
            query: {taskId:row._id}
          })
        },

        openFailInfo(taskId){
          taskApi.getFailInfoUrl(taskId)
            .then(resp => axios.get(resp.data))
            .then(resp => {
              this.dialogVisible = true
              this.failInfo = resp.data
            }).catch((err) => {
              this.dialogVisible = false
              this.failInfo = ''
            });
        },

        toResult(row){
          if(row.state == 'initiated' ||row.state == 'waiting'){
            this.$message.error('该任务还未产生结果')
            return false
          }
          if(row.state == 'failed'){
            this.openFailInfo(row._id)
            return false
          }
          this.$router.push({
            path:'/task/result',
            query: {taskId:row._id}
          })
        },
    },
    watch: {
      '$route': 'fetchTasksList'
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