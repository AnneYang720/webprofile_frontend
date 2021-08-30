<template>
  <div>
    <br>
    
    <el-button @click="openDialog" type="primary" style="margin-left:5%;margin-top:2%" plain>查看结果</el-button>

    <el-table
      :data="taskDevProfile"
      :row-style="{height:0+'px'}"
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{padding:0+'px','text-align':'center'}"
      border
      style="width:90%;margin-left:5%;margin-top:2%">
      <el-table-column
        prop="deviceSelfTime"
        label="device self time"
        min-width="20%">
      </el-table-column>

      <el-table-column
        prop="cumulative"
        label="cumulative"
        min-width="20%">
      </el-table-column>

      <el-table-column
        prop="operatorInfo"
        label="operator info"
        min-width="20%">
      </el-table-column>

      <el-table-column
        prop="computation"
        label="computation"
        min-width="20%">
      </el-table-column>

      <el-table-column
        prop="FLOPS"
        label="FLOPS"
        min-width="13%">
      </el-table-column>

      <el-table-column
        prop="memory"
        label="memory"
        min-width="13%">
      </el-table-column>

      <el-table-column
        prop="bandwidth"
        label="bandwidth"
        min-width="15%">
      </el-table-column>

      <el-table-column
        prop="inShapes"
        label="in_shapes"
        min-width="15%">
      </el-table-column>

      <el-table-column
        prop="outShapes"
        label="out_shapes"
        min-width="20%">
      </el-table-column>
    </el-table>

    <el-table
      :data="taskHostProfile"
      :row-style="{height:0+'px'}"
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{padding:0+'px','text-align':'center'}"
      border
      style="width:90%;margin-left:5%;margin-top:2%">
      <el-table-column
        prop="hostSelfTime"
        label="host self time"
        min-width="20%">
      </el-table-column>

      <el-table-column
        prop="cumulative"
        label="cumulative"
        min-width="20%">
      </el-table-column>

      <el-table-column
        prop="operatorInfo"
        label="operator info"
        min-width="20%">
      </el-table-column>

      <el-table-column
        prop="computation"
        label="computation"
        min-width="20%">
      </el-table-column>

      <el-table-column
        prop="FLOPS"
        label="FLOPS"
        min-width="13%">
      </el-table-column>

      <el-table-column
        prop="memory"
        label="memory"
        min-width="13%">
      </el-table-column>

      <el-table-column
        prop="bandwidth"
        label="bandwidth"
        min-width="15%">
      </el-table-column>

      <el-table-column
        prop="inShapes"
        label="in_shapes"
        min-width="15%">
      </el-table-column>

      <el-table-column
        prop="outShapes"
        label="out_shapes"
        min-width="20%">
      </el-table-column>
    </el-table>

    <!-- 弹出窗口 -->
    <el-dialog
      title="查看结果" 
      :visible.sync="dialogVisible"
      width="60%"
      >
      <el-form :model="profileForm" :rules="resultDetailRules" ref="profileForm" label-width="100px" style="width:95%">
        <el-form-item label="task ID" prop="taskId">
          <el-select v-model="profileForm.taskId" style="width:100%">
            <el-option v-for="item in tasksList" :label="item" :key="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="top" prop="top">
          <el-input v-model="profileForm.top" placeholder="number of most time-consuming operators to print"></el-input>
        </el-form-item>
        
        <el-form-item label="type" prop="type">
          <el-tag
            :key="tag"
            v-for="tag in profileForm.type"
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
            @blur="handleInputConfirm">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ filter oprs in the top list by type</el-button>
        </el-form-item>

        <el-form-item label="aggregate-by" prop="aggregate-by">
          <el-select v-model="profileForm.aggregateBy" style="width:100%" placeholder="aggragate profiling result by" >
            <el-option v-for="item in aggregateBy" :label="item" :key="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="opr-name" prop="oprName">
          <el-input v-model="profileForm.oprName" placeholder="filter oprs in the top list by regex of name"></el-input>
        </el-form-item>
        <el-form-item label="input-dtype" prop="inputDtype">
          <el-input v-model="profileForm.inputDtype" placeholder="filter oprs in the top list by input dtype"></el-input>
        </el-form-item>
        <el-form-item label="top-end-key" prop="topEndKey">
          <el-select v-model="profileForm.topEndKey" style="width:100%" placeholder="how time in top is calculated" >
            <el-option v-for="item in topEndKey" :label="item" :key="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="aggregate" prop="aggregate">
          <el-select v-model="profileForm.aggregate" style="width:100%" placeholder="aggregate operations" >
            <el-option v-for="item in aggregate" :label="item" :key="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="order-by" prop="orderBy">
          <el-input v-model="profileForm.orderBy" placeholder="sort result according to given column"></el-input>
        </el-form-item>
        <el-form-item label="copy-time" prop="copyTime">
          <el-checkbox v-model="profileForm.copyTime">show copy time related result</el-checkbox>
        </el-form-item>
        <el-form-item label="min-time" prop="minTime">
          <el-input v-model="profileForm.minTime" placeholder="minimal time of a result to be printed"></el-input>
        </el-form-item>
        <el-form-item label="max-time" prop="maxTime">
          <el-input v-model="profileForm.maxTime" placeholder="maximal time of a result to be printed"></el-input>
        </el-form-item>
        <el-form-item label="show-host" prop="showHost">
          <el-checkbox v-model="profileForm.showHost">show host profiling info</el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="margin-right:10%">
        <el-button @click="closeDialog">关 闭</el-button>
        <el-button type="primary" @click="handleProfile()">查 看</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>
<script>

import taskApi from '@/api/task'

export default {
  data(){
      return {
        taskDevProfile: [],
        taskHostProfile: [],
        totDevTime: '',
        totHosttime: '',
        dialogVisible: false, //填充结果信息的弹出框
        profileForm: {
          taskId: '',
          top: '',
          type: [],
          aggregateBy: '',
          oprName: '',
          inputDtype: '',
          topEndKey: '',
          aggregate: '',
          orderBy: '',
          copyTime: false,
          minTime: '',
          maxTime: '',
          showHost: false,
        },
        resultDetailRules: {
          taskId: [{ required: true, message: '请选择任务', trigger: 'blur'}]
        },          
        tasksList: [], //该用户所有任务的taskId
        aggregateBy: ["None","type"],
        topEndKey: ["end","kern"],
        aggregate: ["max", "min", "sum", "mean"],
        printOnly: ["summary", "device", "host"],
        inputVisible: false,
        inputValue: ''
      }
  },

  created () {
      this.fetchTasksId()
      this.getParams()
  },

  methods: {

      fetchTasksId(){
        taskApi.getTasksId().then(response =>{
          this.tasksList = response.data
        }).catch(() => {
          this.tasksList = []
        });
      },

      handleProfile(){
        this.$refs.profileForm.validate(valid => {
          if(valid){
            this.closeDialog()
            taskApi.taskProfile(this.profileForm).then(response =>{
              this.taskDevProfile = response.deviceList
              this.taskHostProfile = response.hostList
              this.totDevTime = response.tot_dev_time
              this.totHosttime = response.tot_host_time
            }).catch(() => {
              this.taskProfile = []
            });
          }
        })
      },
      
      closeDialog () {
        this.dialogVisible = false
      },

      openDialog () {
        this.dialogVisible = true
        this.$nextTick(()=>{
          this.$refs['profileForm'].resetFields()
        })
      },

      handleClose(tag) {this.profileForm.type.splice(this.profileForm.type.indexOf(tag), 1);},
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.profileForm.type.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      getParams(){
        if(this.$route.query.taskId){
          this.dialogVisible = true
          this.profileForm.taskId = this.$route.query.taskId
        }
      },
  },
  watch: {
    '$route': 'fetchTasksId'
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

</style>