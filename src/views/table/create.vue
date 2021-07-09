<template>
  <div>
    <br>
      <div style="line-height:40px;margin-left:5%"> 新建项目</div>
      <el-form label-width="100px" style="margin-left:5%">
        
        <el-form-item label="mge模型">
          <el-upload
            ref="uploadMGE"
            accept=".mge"
            :multiple="false"
            :auto-upload="false"
            :show-file-list="true"
            :file-list="uploadMGEList"
            :on-change="handleMGEUploadChange">
            <el-button type="primary" slot="trigger">选取文件</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="数据">
          <el-upload
            ref="uploadData"
            accept='.pkl'
            :multiple="false"
            :auto-upload="false"
            :show-file-list="true"
            :file-list="uploadDataList"
            :on-change="handleDataUploadChange">
            <el-button type="primary" slot="trigger">选取文件</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="平台">
          <el-select v-model="chosenPlatform" @change="platformChange" >
            <el-option v-for="item in pList" :label="item" :key="item" :value="item"/>
          </el-select>
        </el-form-item>

        <el-form-item label="版本">
          <el-select v-model="chosenVersion" >
            <el-option v-for="item in vList" :label="item" :key="item" :value="item"/>
          </el-select>
        </el-form-item>

      </el-form>
      
      <el-button style="margin-left:5%" type="primary" @click="handleUpload()">创 建</el-button>

  </div>
</template>
<script>

import taskApi from '@/api/task'
import axios from 'axios'
import {pFileReader} from '@/utils/filereader'

export default {
    data(){
        return {
          uploadMGEList: [],
          uploadDataList: [],
          chosenPlatform: '',
          chosenVersion: '',
          pList: [], //该用户可选的平台架构list
          vList: [], //选中架构后，该用户可选的MegEngine版本list
        }
    },
    created () {
        this.fetchPlatformList()
    },
    methods: {
        // 获取该用户可用的平台
        fetchPlatformList(){
          taskApi.getPlatformList().then(response =>{
            this.total = response.data.total
            this.list = response.data.rows
          }).catch(() => {
            this.$message({
              message: response.message,
              type: (response.flag ? 'success':'error')
            })
          });
        },
        
        // 限制MGE模型上传的个数只有一个，获取上传列表的最后一个
        handleMGEUploadChange(file, uploadMGEList) {
            if (uploadMGEList.length > 0) {
                this.uploadMGEList = [uploadMGEList[uploadMGEList.length - 1]] // 展示最后一次选择的文件
            }
        },

        // 限制数据文件上传的个数只有一个，获取上传列表的最后一个
        handleDataUploadChange(file, uploadDataList) {
            if (uploadDataList.length > 0) {
                this.uploadDataList = [uploadDataList[uploadDataList.length - 1]] // 展示最后一次选择的文件
            }
        },

        //更改平台架构后获得新的MegEngine版本
        platformChange(){
          taskApi.getVList(this.chosenPlatform).then(response =>{
            this.vList = response.data
          }).catch(() => {
            this.$message({
              message: response.message,
              type: (response.flag ? 'success':'error')
            })
          })
        },

        beforeUpload(){
          if(this.uploadMGEList.length==0){
            this.$message.error('MGE模型文件必须上传')
            return false
          }
          if(this.uploadDataList.length==0){
            this.$message.error('数据文件必须上传')
            return false
          }
          if(this.chosenPlatform==''){
            this.$message.error('请选择平台架构')
            return false
          }
          if(this.chosenVersion==''){
            this.$message.error('请选择MegEngine版本')
            return false
          }
          return true
        },

        handleUpload(){
          this.$confirm('确认创建该任务', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            if(this.beforeUpload()){
              let formData = new FormData();
              let e_mge = await pFileReader(this.uploadFileList[0].raw)
              formData.append('mgeFile', new Buffer(e_mge.target.result, 'binary'));
              let e_data = await pFileReader(this.uploadDataList[0].raw)
              formData.append('dataFile', new Buffer(e_data.target.result, 'binary'))
              formData.append('platform', this.chosenPlatform)
              formData.append('version', this.chosenVersion)
              taskApi.createTask(formData).then(response =>{
                  this.$message({
                    message: response.message,
                    type: (response.flag ? 'success':'error')
                  });
                  if(response.flag){//如果成功
                    this.uploadMGEList = []
                    this.uploadDataList= []
                    this.chosenPlatform= ''
                    this.chosenVersion= ''
                    this.vList = []
                  }
              })
            }
          })
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

        handleClose(tag) {this.fileForm.keywords.splice(this.fileForm.keywords.indexOf(tag), 1);},
                
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