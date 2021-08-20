<template>
  <div>
    <br>
      <div style="line-height:40px;margin-left:5%"> 新建项目</div>
      
      <el-form label-width="100px" style="margin-left:5%">  
        <el-form-item label="mge模型">
          <el-upload
            ref="uploadMGE"
            accept=".mge"
            :action="uploadMgeUrl"
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
            accept='.npy'
            :action="uploadDataUrl"
            :multiple="false"
            :auto-upload="false"
            :show-file-list="true"
            :file-list="uploadDataList"
            :on-change="handleDataUploadChange">
            <el-button type="primary" slot="trigger">选取文件</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="worker">
          <el-select v-model="chosenWorker" @change="workerChange" >
            <el-option v-for="item in myWorkerList" :label="item.name" :key="item.name" :value="item.name"/>
          </el-select>
        </el-form-item>

        <el-form-item label="架构">
          <div> {{chosenPlatform}} </div>
        </el-form-item>

        <el-form-item label="版本">
          <div> {{chosenVersion}} </div>
        </el-form-item>

      </el-form>

      <el-button style="margin-left:5%" type="primary" @click="handleUpload()">创 建</el-button>

      <el-table
        :data="myWorkerList"
        :row-style="{height:40+'px'}"
        style="width:90%;margin-left:5%;margin-top:2%">

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
          min-width="15%">
        </el-table-column>

        <el-table-column
          prop="ip"
          label="IP地址"
          min-width="15%">
        </el-table-column>

        <el-table-column
          prop="platform"
          label="平台架构"
          min-width="15%">
        </el-table-column>

        <el-table-column
          prop="mge_version"
          label="MegEngine版本"
          min-width="20%">
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

import taskApi from '@/api/task'
import {pFileReader} from '@/utils/filereader'
import axios from 'axios'

export default {
    data(){
        return {
          uploadMGEList: [],
          uploadDataList: [],
          chosenWorker: '',
          chosenPlatform: '',
          chosenVersion: '',
          myWorkerList: [], //该用户可选的平台架构list
          uploadMgeUrl: '',
          uploadDataUrl: '',
          newTaskId: '',
          saveFlag:true, //两个文件通过url直接上传是否成功
        }
    },
    created () {
        this.fetchMyWorkersList()
    },
    methods: {
        // 获取该用户可用的硬件
        fetchMyWorkersList(){
          taskApi.getMyWorkersList().then(response =>{
            this.myWorkerList = response.data
          }).catch(() => {
            this.myWorkerList = []
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
        workerChange(){
          taskApi.getWorkerInfo(this.chosenWorker).then(response =>{
            this.chosenPlatform = response.data.platform
            this.chosenVersion = response.data.mge_version
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
          if(this.chosenWorker==''){
            this.$message.error('请选择硬件')
            return false
          }
          return true
        },

        // Final
        handleUpload(){
          this.$confirm('确认创建该任务', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            // TODO: Decide file is this.uploadMGEList[0] or this.uploadMGEList[0].raw
            if(this.beforeUpload()){
              console.log(typeof this.uploadMGEList[0].name)
              console.log(typeof this.uploadMGEList[0].raw.name)
              console.log(typeof this.uploadMGEList[0])
              console.log(typeof this.uploadMGEList[0].raw)
              let formData = new FormData();
              formData.append('platform', this.chosenPlatform)
              formData.append('version', this.chosenVersion)
              formData.append('mge_name',this.uploadMGEList[0].name)
              formData.append('data_name',this.uploadDataList[0].name)
              taskApi.createTaskUrl(formData).then(async(response) => {
                  if(response.flag){//如果成功
                    this.uploadMgeUrl = response.data.mgeUrl
                    this.uploadDataUrl = response.data.dataUrl
                    this.newTaskId = response.data.taskId

                    let e_mge = await pFileReader(this.uploadMGEList[0].raw)
                    let res_mge = await axios.put(this.uploadMgeUrl, new Buffer(e_mge.target.result, 'binary'))
                    console.log(res_mge)
                    if(res_mge.status!=200){
                      this.saveFlag = false
                    }

                    let e_data = await pFileReader(this.uploadDataList[0].raw)
                    let res_data = await axios.put(this.uploadDataUrl, new Buffer(e_data.target.result, 'binary'))
                    console.log(res_data)
                    if(res_data.status!=200){
                      this.saveFlag = false
                    }

                    let formData = new FormData();
                    formData.append('taskId', this.newTaskId)
                    formData.append('saveFlag', this.saveFlag)
                    formData.append('platform',this.chosenPlatform)
                    taskApi.saveTaskInfo(formData).then(response =>{
                      if(response.flag){
                        if(this.saveFlag){
                          this.$message.success('新任务创建成功')
                          this.closeUpload() // 清空前端用户上传数据
                        }else{
                          this.$message.error('文件上传失败')
                        }
                      }else{
                        this.$message.error('新任务创建失败')
                      }
                    })
                    

                  }else{
                    this.$message.error('创建上传URL失败!!')
                    return false
                  }
              })
            }
          })
        },

        closeUpload(){
          this.uploadMGEList = []
          this.uploadDataList= []
          this.chosenWorker = ''
          this.chosenPlatform= ''
          this.chosenVersion= ''
        },

    }
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