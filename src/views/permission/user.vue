<template>
  <div>
    <br>

    <el-table
      :data="userList"
      :row-style="{height:40+'px'}"
      style="width:80%;margin-left:10%;margin-top:2%">

      <el-table-column
        prop="_id"
        label="用户ID"
        min-width="30%">
        <template slot-scope="scope">
          <span style="color: DodgerBlue">{{ scope.row._id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="email"
        label="邮箱"
        min-width="20%">
      </el-table-column>

      <el-table-column
        prop="workers"
        label="可用硬件"
        min-width="20%">
      </el-table-column>

      <el-table-column
        label="操作" min-width="10%">
        <template slot-scope="scope">
          <el-button @click.native.stop="openAdd(scope.row)" type="text" size="small">新增</el-button>
        </template>
      </el-table-column>


      <el-table-column
        label="操作"
        min-width="10%">
        <template slot-scope="scope">
          <el-button @click.native.stop="openDel(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    

    <!-- 弹出窗口 -->
    <el-dialog
      title="增加worker"
      :visible.sync="addVisible"
      width="45%"
      >

      <div>
      <div style="line-height:40px;margin-left:5%"> Worker
      <el-select v-model="work_add" style="margin-left:50px">
        <el-option v-for="item in priWorkerList" :label="item.name" :key="item._id" :value="item._id"/>
      </el-select>
      </div>

      <el-button @click="addWorker()" type="primary" style="margin-top:20px;margin-left:70%" size="small">新增</el-button>

    </div>
    </el-dialog>

    <!-- 弹出窗口 -->
    <el-dialog
      title="删除worker"
      :visible.sync="delVisible"
      width="45%"
      >

      <div>
      <div style="line-height:40px;margin-left:5%"> Worker
      <el-select v-model="work_del" style="margin-left:50px">
        <el-option v-for="item in curWorkerList" :label="item" :key="item" :value="item"/>
      </el-select>
      </div>

      <el-button @click="delWorker()" type="primary" style="margin-top:20px;margin-left:70%" size="small">删除</el-button>

    </div>
    </el-dialog>

  </div>
</template>
<script>
import adminApi from '@/api/admin'
export default {
    data(){
        return {
          userList: [], //首页用包名得到的列表
          addVisible: false,
          delVisible: false,
          work_add: '', //待添加给用户的worker
          work_del: '',
          chosenUser: '',
          priWorkerList: [],
          curWorkerList: [],
        }
    },
    created () {
        this.fetchUsersList()
    },
    methods: {
      // TODO 用户信息的显示（角色和设备显示的处理）
        fetchUsersList(){
            // console.log("fetch"+this.currentPage+' '+this.pageSize);
            adminApi.getUsersList().then(response =>{
                this.userList = response.data;
                this.fetchPrivateWorkersList();
            }).catch((err) => {
                this.userList = []
          });
        },

        fetchPrivateWorkersList(){
            // console.log("fetch"+this.currentPage+' '+this.pageSize);
            adminApi.getPrivateWorkersList().then(response =>{
                this.priWorkerList = response.data;
            }).catch((err) => {
                this.priWorkerList = []
            });
        },
      
        addWorker(){
            adminApi.addWorker(this.chosenUser,this.work_add).then(response =>{
              this.$message({
                message: response.message,
                type: (response.flag ? 'success':'error')
              });
            }).catch((err) => {
              this.$message({
                message: response.message,
                type: (response.flag ? 'success':'error')
              })
            });
            this.closeAdd() // 关闭窗口
        },

        delWorker(){
            adminApi.delWorker(this.chosenUser,this.work_del).then(response =>{
              this.$message({
                message: response.message,
                type: (response.flag ? 'success':'error')
              });
            }).catch((err) => {
              this.$message({
                message: response.message,
                type: (response.flag ? 'success':'error')
              })
            });
            this.closeDel() // 关闭窗口
        },

        openAdd(row){
          this.addVisible = true
          this.work_add = ''
          this.chosenUser = row._id
        },

        closeAdd(){
          this.fetchUsersList()
          this.addVisible = false
        },

        openDel(row){
          this.delVisible = true
          this.curWorkerList = row.workers
          this.work_del = ''
          this.chosenUser = row._id
        },

        closeDel(){
          this.fetchUsersList()
          this.delVisible = false
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