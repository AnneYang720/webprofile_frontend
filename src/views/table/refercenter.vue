<template>
  <div>
    <br>
    <el-form :inline="true" align="left" style="margin-left:10%;margin-top:2%">     
          <el-form-item >
            <el-input v-model="keywords"></el-input>
          </el-form-item>
        
        <el-button @click="handleSearch()" type="primary" plain>搜索</el-button>
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
        prop="userName"
        label="上传者"
        min-width="15%">
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
          keywords:'', //搜索关键词
          currentReferName:'', //当前选中行的文献标题
          currentAuthor:'', //当前选中行的文献作者
          currentKeywords:[], //当前选中行的文献关键词
          currentReferUrl:'', //当前选中行的文献下载链接
          detailVisible: false, //点开某行展示文件内容的弹出框
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

        handleSearch(){
          if(this.keywords==='') this.fetchData();
          else {
            referApi.search(this.currentPage, this.pageSize, this.keywords).then(response =>{
                this.total = response.data.total
                this.list = response.data.rows
            }).catch(() => {
                this.total = 0
                this.list = []
            });
          }
        },

        handleSizeChange(val) {
          this.pageSize = val;
          if(this.keywords==='') this.fetchData();
          else this.handleSearch();
        },

        handleCurrentChange(val) {
          this.currentPage = val;
          if(this.keywords==='') this.fetchData();
          else this.handleSearch();
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