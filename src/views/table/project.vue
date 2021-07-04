<template>
  <div>
    <br>
    <el-form :inline="true" align="left">
      <el-button @click="openCreate" type="primary" style="margin-left:10%;margin-bottom:2%" plain>新建项目</el-button>
    </el-form>


    <el-table
      :data="list"
      :row-style="{height:40+'px'}"
      @expand-change="expandSelect"
      :row-key="getRowKey"
      :expand-row-keys="expands"
      style="width:80%;margin-left:10%">
      
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
              <el-table-column
                label="操作" min-width="10%">
                <template slot-scope="scope">
                  <el-button @click.native.stop="delFiles(scope.row)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
              <el-table-column
                label="操作" min-width="10%">
                <template slot-scope="scope">
                  <el-button @click.native.stop="openUpdate(scope.row)" type="text" size="small">更新</el-button>
                </template>
              </el-table-column>
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
        label="上传"
        min-width="9%">
        <template slot-scope="scope">
          <el-button @click.native.stop="openUpload(scope.row)" type="text" size="small">上传文件</el-button>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        min-width="9%">
        <template slot-scope="scope">
          <el-button @click.native.stop="delProject(scope.row)" type="text" size="small">删除</el-button>
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
      title="新建项目" 
      :visible.sync="createDialogVisible"
      width="40%"
      >
      <el-form :model="createForm" :rules="createRules" ref="createForm" label-width="100px" style="width:95%">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="createForm.projectName" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="margin-right:10%">
        <el-button @click="closeCreate">关 闭</el-button>
        <el-button type="primary" @click="handleCreate()">新 建</el-button>
      </span>
    </el-dialog>

    <!-- 弹出窗口 -->
    <el-dialog
      title="上传文件" 
      :visible.sync="uploadDialogVisible"
      width="40%"
      >
      <div style="line-height:40px;margin-left:5%"> <span>目标项目</span><span style="color:black;margin-left:27px">{{projectName}}</span> </div>
      <el-form :model="fileForm" :rules="uploadRules" ref="fileForm" label-width="100px" style="width:95%">
        <el-form-item label="文件名称" prop="fileName">
          <el-input v-model="fileForm.fileName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="关键词" prop="keywords">
        <el-tag
          :key="tag"
          v-for="tag in fileForm.keywords"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

        </el-form-item>
        <el-form-item label="文件">
          <el-upload
            ref="uploadFile"
            :action="uploadFileUrl"
            :multiple="false"
            :auto-upload="false"
            :show-file-list="true"
            :file-list="uploadFileList"
            :on-change="handleFileUploadChange">
            <el-button type="primary" slot="trigger">选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer" style="margin-right:10%">
        <el-button @click="closeUpload()">关 闭</el-button>
        <el-button type="primary" @click="handleUpload(true)">上 传</el-button>
      </span>
    </el-dialog>

    <!-- 弹出窗口 -->
    <el-dialog
      title="更新文件信息" 
      :visible.sync="updateDialogVisible"
      width="40%"
      >
      <div style="line-height:40px;margin-left:5%"> <span>文件名</span><span style="color:black;margin-left:27px">{{currentFileName}}</span> </div>
      <el-form :model="fileForm" :rules="updateRules" ref="fileForm" label-width="100px" style="width:95%">

        <el-form-item label="关键词" prop="keywords">   
        <el-tag
          :key="tag"
          v-for="tag in fileForm.keywords"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

        </el-form-item>


        <el-form-item label="文件">
          <el-upload
            ref="uploadFile"
            :action="uploadFileUrl"
            :multiple="false"
            :auto-upload="false"
            :show-file-list="true"
            :file-list="uploadFileList"
            :on-change="handleFileUploadChange">
            <el-button type="primary" slot="trigger">选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer" style="margin-right:10%">
        <el-button @click="closeUpdate()">关 闭</el-button>
        <el-button type="primary" @click="handleUpload(false)">更 新</el-button>
      </span>
    </el-dialog>

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
      <el-button @click="delVersion()" type="primary"  size="small">删除此版本</el-button>

    </div>
    </el-dialog>


  </div>
</template>
<script>

import projectApi from '@/api/project'
import axios from 'axios'
import {pFileReader} from '@/utils/filereader'

export default {
    data(){
        return {
          list: [], //首页用包名得到的列表
          total:  0, //总条数
          currentPage: 1, //当前页数
          pageSize: 10, //每页条数
          currentFileName: '', //当前选中行的文件名
          currentUrl: '', //当前文件的下载地址和上传时间
          currentKeywords: '', //当前文件的关键词
          createDialogVisible: false, //新建项目的弹出框
          uploadDialogVisible: false, //上传新文件的弹出框
          detailVisible: false, //点开某行展示文件内容的弹出框
          updateDialogVisible: false, //更新系列文件的弹出框
          uploadFileUrl: '',
          currentUploadDate: '',
          saveFlag: true, //文件通过url直接上传是否成功
          projectName: '', //上传文件时选中的项目名称
          expandProjectId: '', //当前展开的项目编号
          uploadFileList: [], //用户上传的文件列表
          chosenVersion: '', //当前选中的版本号
          vList: [], //记录某一行的versionList
          createForm: {
            projectName: ''
          },
          fileForm: {
            id:'',
            fileName: '',
            keywords: [],
            projectId:''
          },
          createRules: {
            projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur'}]
          },
          uploadRules: {
            fileName: [{ required: true, message: '请输入文件名称', trigger: 'blur'}],
            keywords: [{ type: 'array', max: 5, message: '最多添加5个关键词' }]
          },
          updateRules: {
            keywords: [{ type: 'array', max: 5, message: '最多添加5个关键词' }]
          },
          fileList: [],
          expands: [],
          getRowKey(row) { return row.id },
          inputVisible: false,
          inputValue: ''
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

        
        handleCreate(){
          this.$refs.createForm.validate(valid => {
            if(valid){
              projectApi.createProject(this.createForm).then(response =>{
                this.$message({
                  message: response.message,
                  type: (response.flag ? 'success':'error')
                });
                if(response.flag){//如果成功
                  this.fetchData()
                }
              })
              this.closeCreate()
            }else{
              this.$message.error('项目名称不能为空')
            }
          })
        },

        // 限制文件上传的个数只有一个，获取上传列表的最后一个
        handleFileUploadChange(file, uploadFileList) {
            if (uploadFileList.length > 0) {
                this.uploadFileList = [uploadFileList[uploadFileList.length - 1]] // 这一步，是 展示最后一次选择的文件
            }
        },

        handleUpload(flag) {
            if(flag){
                if(this.uploadFileList.length==0){
                    this.$message.error('文件必须上传')
                    return false
                }
                this.fileForm.fileName += this.uploadFileList[0].name.substring(this.uploadFileList[0].name.lastIndexOf('.'))
                this.$refs.fileForm.validate(valid => {
                    if(valid){
                        this.handleCreateURL()
                    }else {
                        console.log('error submit!!')
                        this.$message.error('信息格式错误')
                        return false
                    }

                })
                this.closeUpload() // 关闭窗口
            }else{
                this.fileForm.fileName = this.currentFileName
                this.fileForm.projectId = this.expandProjectId
                this.$refs.fileForm.validate(valid => {
                    if(valid){
                        if(this.uploadFileList.length>0){
                            this.handleCreateURL()
                        }
                        if(this.fileForm.keywords!=this.currentKeywords){
                            projectApi.updateFile(this.fileForm).then(response =>{
                                this.$message({
                                message: response.message,
                                type: (response.flag ? 'success':'error')
                                });
                                if(response.flag){//如果成功
                                this.fetchData()
                                this.expands = []
                                }
                            })
                        }
                    }else{
                        console.log('error submit!!')
                        this.$message.error('信息格式错误')
                        return false
                    }
                })
                this.closeUpdate() // 关闭窗口
            }
        },


        handleCreateURL(){
            projectApi.createURL(this.fileForm).then(async(response) => {
                if(response.flag){
                  this.uploadFileUrl = response.data.uploadFileUrl
                  this.fileForm.id = response.data.fileId

                  let e = await pFileReader(this.uploadFileList[0].raw)
                  let res = await axios.put(this.uploadFileUrl, new Buffer(e.target.result, 'binary'))
                  //console.log(res)
                  if(res.status!=200){
                    this.saveFlag = false
                    this.$message.error('文件上传失败')
                    throw new Error('文件上传失败！')
                  }
                  
                  if(this.saveFlag){
                    //console.log('save')
                    projectApi.saveFile(this.fileForm).then(response =>{
                      this.$message({
                        message: response.message,
                        type: (response.flag ? 'success':'error')
                      });
                      if(response.flag){
                          this.fetchData()
                        }
                      })
                  }else{
                    this.$message.error('文件上传失败')
                    return false
                  }
                  
                }else {
                  console.log('创建上传URL失败!!')
                  return false
                }
              })
        },

        downFile () {
          //console.log(downloadurl)
          var ele = document.createElement('a')
          ele.download = this.currentFileName
          ele.style.display = 'none';
          ele.href = this.currentUrl
          ele.target="_blank"; // 针对 ie模式 的浏览器
          // 触发点击
          document.body.appendChild(ele);
          ele.click();
          // 然后移除
          document.body.removeChild(ele);
        },

        delProject(row){
            this.$confirm('您确定要删除此项目吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            projectApi.deleteProject(row.id).then(response =>{
              this.$message({
                message: response.message,
                type: (response.flag ? 'success':'error')
              });
              if(response.flag){
                this.fetchData()
              }
            })
          }).catch(() => {
          });
        },

        delFiles(row){
          this.$confirm('您确定要删除此系列文件吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //console.log("delete this group")
            projectApi.deleteFiles(this.expandProjectId,row.fileName).then(response =>{
              this.$message({
                message: response.message,
                type: (response.flag ? 'success':'error')
              });
              if(response.flag){
                this.fetchData()
                this.expands = []
              }
            })
          }).catch(() => {
          });
        },

        delVersion(){
          this.$confirm('您确定要删除此版本吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //console.log("delete this version")
            projectApi.deleteVersion(this.expandProjectId,this.currentFileName,this.chosenVersion).then(response =>{
              this.$message({
                message: response.message,
                type: (response.flag ? 'success':'error')
              });
              if(response.flag){
                this.expands = []
                this.fetchData()
              }
            })
          }).catch(() => {
          });
          this.detailVisible = false
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
          this.currentKeywords = row.keywords
          this.vList = row.versionList
          this.vList.reverse()
          this.chosenVersion = row.latestVersion
          this.urlChange()
        },


        closeCreate() {
          this.createDialogVisible = false
        },

        openCreate() {
          this.createDialogVisible = true
          this.$nextTick(()=>{
            this.$refs['createForm'].resetFields()
          })
        },

        closeUpload() {
          this.uploadDialogVisible = false
        },

        openUpload(row) {
          this.uploadDialogVisible = true
          this.projectName = row.projectName
          this.$nextTick(()=>{
            this.$refs['fileForm'].resetFields()
          })
          this.fileForm.projectId = row.id
          this.uploadFileList = []
        },

        closeUpdate() {
          this.updateDialogVisible = false
        },

        openUpdate(row) {
          this.detailVisible = false
          this.updateDialogVisible = true
          this.currentFileName = row.fileName
          this.currentKeywords = row.keywords
          console.log("keywords "+this.currentKeywords)
          this.$nextTick(()=>{
            this.$refs['fileForm'].resetFields()
          })
          this.fileForm.keywords = (row.keywords.length == 1 && row.keywords[0] == "") ? [] : row.keywords
          this.uploadFileList = []
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

        handleClose(tag) {this.fileForm.keywords.splice(this.fileForm.keywords.indexOf(tag), 1);},
        showInput() {
          this.inputVisible = true;
          this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
          });
        },
        handleInputConfirm() {
          let inputValue = this.inputValue;
          if (inputValue) {
            this.fileForm.keywords.push(inputValue);
          }
          this.inputVisible = false;
          this.inputValue = '';
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

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

</style>