<template>
  <div>
    <br>

    <el-table
      :data="list"
      :row-style="{height:40+'px'}"
      @expand-change="expandSelect"
      :row-key="getRowKey"
      :expand-row-keys="expands"
      style="width:80%;margin-left:10%;margin-top:2%">
      
      <el-table-column type="expand" prop="">
          <template >
            <el-table :data="fileList" @row-click="rowClick">

              <el-table-column prop="fileName" label="文件名" min-width="35%">
                <template slot-scope="scope">
                  <i style="color:#409EFF;margin-left: 20px;" class="el-icon-tickets"></i>
                  <span style="color: DodgerBlue">{{ scope.row.fileName }}</span>
                </template>
              </el-table-column>

              <el-table-column prop="keywords" label="关键词" :formatter="formatKeywords" min-width="20%"></el-table-column>
              <el-table-column prop="latestVersion" label="最新版本" min-width="10%"></el-table-column>
              <el-table-column prop="versionNum" label="版本数" min-width="10%"></el-table-column>
              <el-table-column prop="updateDate" label="更新时间" :formatter="formatDate" min-width="15%"></el-table-column>
            </el-table>
          </template>
      </el-table-column>
      

      <el-table-column
        prop="projectName"
        label="项目名称"
        min-width="55%">
        <template slot-scope="scope">
          <i class="el-icon-folder-opened"></i>
          <span style="color: DodgerBlue">{{ scope.row.projectName }}</span>
        </template>
      </el-table-column>



      <el-table-column
        prop="userName"
        label="创建者"
        min-width="24%">
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
      :title="currentFileName"
      :visible.sync="detailVisible"
      width="45%"
      >

      <div>
      <div style="line-height:40px;margin-left:5%"> <span>上传时间</span><span style="color:black;margin-left:27px">{{currentUploadDate}}</span> </div>
      
      <div style="line-height:40px;margin-left:5%"> 版本
      <el-select v-model="chosenVersion" @change="urlChange" style="margin-left:50px">
        <el-option v-for="item in vList" :label="item" :key="item" :value="item"/>
      </el-select>
      </div>

      <el-button @click="downFile()" type="primary" style="margin-top:20px;margin-left:70%" size="small">下载</el-button>

    </div>
    </el-dialog>


  </div>
</template>
<script>

import projectApi from '@/api/project'

export default {
    data(){
        return {
          list: [], //首页用包名得到的列表
          total:  0, //总条数
          currentPage: 1, //当前页数
          pageSize: 10, //每页条数
          currentFileName: '', //当前选中行的文件名
          currentUrl: '', //当前文件的下载地址和上传时间
          expandProjectId: '', //当前展开的项目编号
          currentUploadDate:'',
          detailVisible: false, //点开某行展示文件内容的弹出框
          expandProjectId: '', //当前展开的项目编号
          chosenVersion: '', //当前选中的版本号
          vList: [], //记录某一行的versionList
          fileList: [],
          expands: [],
          getRowKey(row) { return row.id },
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        fetchData(){
            projectApi.getProjectList(this.$router.currentRoute.name,this.currentPage,this.pageSize).then(response =>{
                this.total = response.data.total
                this.list = response.data.rows
            }).catch(() => {
                this.total = 0
                this.list = []
          });
        },

        handleSizeChange(val) {
          this.pageSize = val;
          this.fetchData();
        },

        handleCurrentChange(val) {
          this.currentPage = val;
          this.fetchData();
        },

        downFile () {
          //console.log(downloadurl)
          var ele = document.createElement('a')
          ele.download = this.currentUrl
          ele.style.display = 'none';
          ele.href = this.currentUrl
          ele.target="_blank"; // 针对 ie模式 的浏览器
          // 触发点击
          document.body.appendChild(ele);
          ele.click();
          // 然后移除
          document.body.removeChild(ele);
        },

        //更改版本后获得新的url
        urlChange(){
          projectApi.getUrl(this.expandProjectId,this.currentFileName,this.chosenVersion).then(response =>{
            this.currentUrl = response.data.downloadUrl
            let dt = new Date(response.data.updateDate)
            this.currentUploadDate = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes()
          }).catch(() => {
            this.$message({
              message: response.message,
              type: (response.flag ? 'success':'error')
            })
          })
        },

        formatDate(row, column) {
          let data = row[column.property]
          let dt = new Date(data)
          return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes()
        },

        formatKeywords(row, column){
          return row[column.property].join(', ');
        },

        //监听row-click事件，实现选中
        rowClick(row, column, event) {
          this.detailVisible = true
          this.currentFileName = row.fileName
          this.vList = row.versionList
          this.vList.reverse()
          this.chosenVersion = row.latestVersion
          this.urlChange()
        },


        expandSelect(row, expandedRows){
          this.expands = []
          if (expandedRows.length>0) {
            projectApi.getFileList(row.id).then(response =>{
                this.fileList = response.data
                this.expandProjectId = row.id
                console.log(row.projectName)
                row ? this.expands.push(row.id):'' 
            }).catch(() => {
                this.total = 0
                this.fileList = []
            })           
          }
        },

    },
    watch: {
      '$route': 'fetchData'
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