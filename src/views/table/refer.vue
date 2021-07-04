<template>
  <div>
    <br>
    <el-form :inline="true" align="left">
      <el-button @click="openUpload()" type="primary" style="margin-left:10%;margin-bottom:2%;margin-top:2%" plain>上传文献</el-button>
    </el-form>

    <el-table
      :data="list"
      :row-style="{height:40+'px'}"
      @row-click="rowClick"
      style="width:80%;margin-left:10%">
      
      <el-table-column
        prop="referName"
        label="文献名称"
        min-width="55%">
        <template slot-scope="scope">
          <i style="color:#409EFF" class="el-icon-tickets"></i>
          <span style="color: DodgerBlue">{{ scope.row.referName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="keywords"
        label="关键词"
        :formatter="formatKeywords"
        min-width="25%">
      </el-table-column>

      <el-table-column
        label="操作"
        min-width="10%">
        <template slot-scope="scope">
          <el-button @click.native.stop="delRefer(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>

      <el-table-column
        label="操作" min-width="10%">
        <template slot-scope="scope">
          <el-button @click.native.stop="openUpdate(scope.row)" type="text" size="small">更新</el-button>
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
      title="上传文献" 
      :visible.sync="uploadDialogVisible"
      width="40%"
      >
      <el-form :model="uploadForm" :rules="uploadRules" ref="uploadForm" label-width="100px" style="width:95%">
        <el-form-item label="文献标题" prop="referName">
          <el-input v-model="uploadForm.referName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="文献作者" prop="author">
          <el-input v-model="uploadForm.author" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="关键词" prop="keywords">
          <el-tag
          :key="tag"
          v-for="tag in uploadForm.keywords"
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
            ref="uploadRefer"
            :action="uploadReferUrl"
            :multiple="false"
            :auto-upload="false"
            :show-file-list="true"
            :file-list="uploadReferList"
            :on-change="handleReferUploadChange">
            <el-button type="primary" slot="trigger">选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer" style="margin-right:10%">
        <el-button @click="closeUpload()">关 闭</el-button>
        <el-button type="primary" @click="handleUpload()">上 传</el-button>
      </span>
    </el-dialog>

    <!-- 弹出窗口 -->
    <el-dialog
      title="修改文献信息" 
      :visible.sync="updateDialogVisible"
      width="40%"
      >
      <div style="line-height:40px;margin-left:13%"> <span>文件名</span><span style="color:black;margin-left:27px">{{currentReferName}}</span> </div>
      <el-form :model="uploadForm" :rules="uploadRules" ref="uploadForm" label-width="100px">

        <el-form-item label="关键词" prop="keywords">   
        <el-tag
          :key="tag"
          v-for="tag in uploadForm.keywords"
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



      </el-form>
      
      <span slot="footer" class="dialog-footer" style="margin-right:10%">
        <el-button @click="closeUpdate()">关 闭</el-button>
        <el-button type="primary" @click="handleUpdate()">更 新</el-button>
      </span>
    </el-dialog>



    <!-- 弹出窗口 -->
    <el-dialog
      title="文献下载"
      :visible.sync="detailVisible"
      width="45%"
      >

      <div>
      <div style="line-height:40px;margin-left:5%"> <span>标题</span><span style="color:black;margin-left:40.5px">{{currentReferName}}</span> </div>
      <div style="line-height:40px;margin-left:5%"> <span>作者</span><span style="color:black;margin-left:40.5px">{{currentAuthor}}</span> </div>
      <div style="line-height:40px;margin-left:5%"> <span>关键词</span><span style="color:black;margin-left:27px">{{currentKeywords}}</span> </div>
      </div>


      <el-button @click="downRefer()" type="primary" style="margin-top:20px;margin-left:75%" size="small">下载</el-button>

    </el-dialog>


  </div>
</template>
<script>

import referApi from '@/api/refer'
import axios from 'axios'
import {pFileReader} from '@/utils/filereader'

export default {
    data(){
        return {
          list: [], //首页用包名得到的列表
          total:  0, //总条数
          currentPage: 1, //当前页数
          pageSize: 10, //每页条数
          currentReferName:'', //当前选中行的文献标题
          currentAuthor:'', //当前选中行的文献作者
          currentKeywords:[], //当前选中行的文献关键词
          currentReferUrl:'', //当前选中行的文献下载链接
          uploadDialogVisible: false, //上传新文件的弹出框
          updateDialogVisible: false, //更新系列文件的弹出框
          detailVisible: false, //点开某行展示文件内容的弹出框
          uploadReferUrl:'',
          saveFlag:true, //文件通过url直接上传是否成功
          uploadReferList: [], //用户上传的文件列表

          uploadForm: {
            id:'',
            referName: '',
            author:'',
            keywords: [],
          },

          uploadRules: {
            referName: [{ required: true, message: '请输入文件名称', trigger: 'blur'}],
            keywords: [{ type: 'array', max: 5, message: '最多添加5个关键词' }]
          },
          inputVisible: false,
          inputValue: ''
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        fetchData(){
            referApi.getReferList(this.$router.currentRoute.name,this.currentPage,this.pageSize).then(response =>{
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


        // 限制文件上传的个数只有一个，获取上传列表的最后一个
        handleReferUploadChange(file, uploadReferList) {
            if (uploadReferList.length > 0) {
                this.uploadReferList = [uploadReferList[uploadReferList.length - 1]] // 这一步，是 展示最后一次选择的文件
            }
        },

        handleUpload(){
          if(this.beforeuploadRefer()){
            this.$refs.uploadForm.validate(valid => {
              if (valid) {
                referApi.createURL(this.uploadForm).then(async(response) => {
                  if(response.flag){
                    this.uploadReferUrl = response.data.uploadReferUrl
                    this.uploadForm.id = response.data.referId

                    let e = await pFileReader(this.uploadReferList[0].raw)
                    let res = await axios.put(this.uploadReferUrl, new Buffer(e.target.result, 'binary'))
                    //console.log(res)
                    if(res.status!=200){
                      this.saveFlag = false
                      this.$message.error('文件上传失败')
                      throw new Error('文件上传失败！')
                    }
                    
                    if(this.saveFlag){
                      //console.log('save')
                      referApi.saveRefer(this.uploadForm).then(response =>{
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
              }else {
                console.log('error submit!!')
                this.$message.error('信息格式错误')
                return false
              }
            })
          }
          this.closeUpload() // 关闭窗口
        },

        beforeuploadRefer(){
          if(this.uploadReferList.length==0){
            this.$message.error('文件必须上传')
            return false
          }
          this.uploadForm.referName += this.uploadReferList[0].name.substring(this.uploadReferList[0].name.lastIndexOf('.'))
          return true
        },

        handleUpdate(row){
          this.$refs.uploadForm.validate(valid => {
              if(valid){
                  if(this.uploadForm.keywords!=this.currentKeywords){
                      referApi.updateRefer(this.uploadForm).then(response =>{
                          this.$message({
                          message: response.message,
                          type: (response.flag ? 'success':'error')
                          });
                          if(response.flag){//如果成功
                          this.fetchData()
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
        },
        
        downRefer () {
          //console.log(this.currentReferUrl)
          var ele = document.createElement('a')
          ele.download = this.currentReferUrl
          ele.style.display = 'none';
          ele.href = this.currentReferUrl
          ele.target="_blank"; // 针对 ie模式 的浏览器
          // 触发点击
          document.body.appendChild(ele);
          ele.click();
          // 然后移除
          document.body.removeChild(ele);
        },

        formatKeywords(row, column) {
          return row[column.property].join(", ")
        },



        delRefer(row){
          this.$confirm('您确定要删除此文献吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //console.log("delete this group")
            referApi.deleteRefer(row.id).then(response =>{
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

        //监听row-click事件，实现选中
        rowClick(row, column, event) {
          this.currentReferName = row.referName
          this.currentAuthor = row.author
          this.currentKeywords = row.keywords.join(", ")
          referApi.getUrl(row.id,row.userId).then(response =>{
            this.currentReferUrl = response.data
          }).catch(() => {
            this.$message({
              message: response.message,
              type: (response.flag ? 'success':'error')
            })
          })
          this.detailVisible = true
        },



        closeUpload() {
          this.uploadDialogVisible = false
        },

        openUpload(row) {
          this.uploadDialogVisible = true
          this.$nextTick(()=>{
            this.$refs['uploadForm'].resetFields()
          })
          this.uploadReferList = []
        },

        closeUpdate() {
          this.updateDialogVisible = false
        },

        openUpdate(row) {
          this.detailVisible = false
          this.updateDialogVisible = true
          this.currentReferName = row.referName
          //console.log("keywords "+row.keywords)
          this.$nextTick(()=>{
            this.$refs['uploadForm'].resetFields()
          })
          this.uploadForm.keywords = (row.keywords.length == 1 && row.keywords[0] == "") ? [] : row.keywords
          this.uploadForm.id = row.id
    
        },

        handleClose(tag) {this.uploadForm.keywords.splice(this.uploadForm.keywords.indexOf(tag), 1);},
        showInput() {
          this.inputVisible = true;
          this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
          });
        },
        handleInputConfirm() {
          let inputValue = this.inputValue;
          if (inputValue) {
            this.uploadForm.keywords.push(inputValue);
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
</style>