<template>
  <div>
    <br>

    <el-button @click="openAddAdmin" type="primary" icon="el-icon-plus" style="margin-left:10%;margin-bottom:1%;margin-top:2%" plain>添加管理员</el-button>
    <el-button @click="openDelAdmin" type="danger" icon="el-icon-delete" style="margin-left:1%" plain>删除管理员</el-button>
    <el-button @click="openChangePwd" type="warning" icon="el-icon-edit" style="margin-left:1%" plain>修改密码</el-button>


    <el-table
      :data="userList"
      :row-style="{height:40+'px'}"
      style="width:80%;margin-left:10%;margin-top:2%">

      <el-table-column
        prop="_id"
        label="用户ID"
        min-width="25%">
        <template slot-scope="scope">
          <span style="color: DodgerBlue">{{ scope.row._id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="email"
        label="邮箱"
        min-width="15%">
      </el-table-column>

      <el-table-column
        prop="roles"
        label="角色"
        :formatter="formatList"
        min-width="15%">
      </el-table-column>

      <el-table-column
        prop="workers"
        label="私有硬件"
        :formatter="formatList"
        min-width="20%">
      </el-table-column>

      <el-table-column
        label="操作" 
        min-width="5%">
        <template slot-scope="scope">
          <el-button @click.native.stop="openAdd(scope.row)" type="text" size="small">新增</el-button>
        </template>
      </el-table-column>


      <el-table-column
        label="操作"
        min-width="5%">
        <template slot-scope="scope">
          <el-button @click.native.stop="openDel(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    

    <!-- 增加worker弹出窗口 -->
    <el-dialog
      title="增加worker"
      :visible.sync="addWorkerVisible"
      width="45%"
      >

      <div>
      <div style="line-height:40px;margin-left:5%"> Worker
      <el-select v-model="work_add" style="margin-left:50px">
        <el-option v-for="item in priWorkerList" :label="item.name" :key="item.name" :value="item.name"/>
      </el-select>
      </div>

      <el-button @click="addWorker()" type="primary" style="margin-top:20px;margin-left:70%" size="small">新增</el-button>

    </div>
    </el-dialog>

    <!-- 删除worker弹出窗口 -->
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

    <!-- 增加管理员弹出窗口 -->
    <el-dialog
      title="添加管理员"
      :visible.sync="addAdminVisible"
      width="30%"
      >
      <el-input v-model="admin_add" placeholder="请输入用户邮箱"></el-input>
      <el-button @click="addAdmin()" type="primary" style="margin-top:20px" size="small">添加</el-button>
    </el-dialog>

    <!-- 删除管理员弹出窗口 -->
    <el-dialog
      title="删除管理员"
      :visible.sync="delAdminVisible"
      width="30%"
      >
      <el-input v-model="admin_del" placeholder="请输入用户邮箱"></el-input>
      <el-button @click="delAdmin()" type="danger" style="margin-top:20px" size="small">删除</el-button>
    </el-dialog>

    <!-- 修改密码弹出窗口 -->
    <el-dialog
      title="修改密码"
      :visible.sync="changePwdVisible"
      width="30%"
      >

      <el-form :model="changePwdForm" :rules="changePwdRules" ref="changePwdForm">
        <el-form-item prop="email">
          <span>
              <svg-icon icon-class="user" />
          </span>
          <el-input class="el-input-change" v-model="changePwdForm.email" placeholder="请输入用户邮箱"></el-input>
        </el-form-item>
      
        <el-form-item prop="password">
          <span>
              <svg-icon icon-class="password"></svg-icon>
          </span>
          <el-input name="password" :type="pwdType" v-model="changePwdForm.password" 
              class="el-input-change" placeholder="password"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
        </el-form-item>
      </el-form>
      
      <el-button @click="changePwd()" type="warning" style="margin-left:5%" size="small">修改</el-button>

    </el-dialog>



  </div>
</template>
<script>
import adminApi from '@/api/admin'
export default {
    data(){
        var validatePass = (rule, value, callback) => {
          var pattern = /^\S{6,20}$/g
          if (value === '') {
            callback(new Error('请输入密码'))
          } else if (!pattern.test(value)) {
            callback(new Error('请输入6-20个非空白字符'))
          } else {
            callback()
          }
        }

        return {
          userList: [], //首页用包名得到的列表
          addWorkerVisible: false,
          delVisible: false,
          work_add: '', //待添加给用户的worker
          work_del: '',
          chosenUser: '',
          priWorkerList: [],
          curWorkerList: [],
          addAdminVisible: false,
          delAdminVisible: false, 
          admin_add: '',
          admin_del: '',
          changePwdVisible: false,
          changePwdForm: {
            email: '',
            password: ''
          },
          changePwdRules: {
            email: [
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
            ],
            password: [{ required: true, trigger: 'blur', validator: validatePass }]
          },
          pwdType: 'password',
        }
    },
    created() {
        this.fetchUsersList()
    },
    computed: {
      mdpassword: function () {
        return coreJS.encryptedPassword(this.changePwdForm.password)
      }
    },
    methods: {
      // TODO 当前方法信息查询量和次数较多
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

        addAdmin(){
            adminApi.addAdmin(this.admin_add).then(response =>{
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
            this.addAdminVisible = false // 关闭窗口
        },

        delAdmin(){
            adminApi.delAdmin(this.admin_del).then(response =>{
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
            this.delAdminVisible = false // 关闭窗口
        },

        changePwd(){
          this.$refs.changePwdForm.validate(valid => {
            if (!valid) return false

            this.loading = true
            this.changePwdForm.password = this.mdpassword
            adminApi.changePwd(this.changePwdForm).then(response => {
              this.$message({
                message: response.message,
                type: (response.flag ? 'success':'error')
              });
            }).catch(() => {
              this.$message({
                message: response.message,
                type: (response.flag ? 'success':'error')
              })
            })
            this.changePwdVisible = false
          })
        },

        openAdd(row){
          this.addWorkerVisible = true
          this.work_add = ''
          this.chosenUser = row._id
        },

        closeAdd(){
          this.fetchUsersList()
          this.addWorkerVisible = false
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

        openAddAdmin(){
          this.addAdminVisible = true
          this.admin_add = ''
        },

        openDelAdmin(){
          this.delAdminVisible = true
          this.admin_add = ''
        },

        openChangePwd(){
          this.changePwdVisible = true
          this.$nextTick(()=>{
            this.$refs['changePwdForm'].resetFields()
          })
        },

        formatList(row, column) {
          return row[column.property].join(", ")
        },

        showPwd() {
          if (this.pwdType === 'password') {this.pwdType = ''} 
          else {this.pwdType = 'password'}
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
.el-input-change {
      display: inline-block;
      height: 47px;
      width: 85%;
}
</style>