<template>
    <div>
        <div class="div1" style="margin-left:2%"> 选择任务 </div>
        <el-select v-model="chosenTaskId" label="平台" style="margin-left:2%">
            <el-option v-for="item in tasksList" :label="item" :key="item" :value="item"/>
        </el-select>
        <el-button style="margin-left:2%" type="primary" @click="handleNetVisualize()">显 示</el-button>

        <iframe id="netron" class="chart-container" :src="log_url" />
    </div>
    
</template>

<script>
import taskApi from '@/api/task'
export default {
    data(){
        return {
            tasksList: [], //该用户所有任务的taskId
            log_url: '',
            chosenTaskId: '',
            
        }
    },
    created () {
        this.fetchTasksId()
    },
    methods: {
        // 获取所有任务id列表
        fetchTasksId(){
            taskApi.getTasksId().then(response =>{
                this.tasksList = response.data
            }).catch(() => {
                this.tasksList = []
            });
        },

        handleNetVisualize(){
            if(this.chosenTaskId==''){
                this.$message.error('请选择任务ID')
                return false
            }            
            taskApi.netVisualize(this.chosenTaskId).then(response =>{
                this.log_url = '/static/netron/?identifier=events.out.tfevents.mgemodel&url='+encodeURIComponent(response.data)
                console.log(this.log_url)
            }).catch(() => {
                this.log_url = ''
            })

        },

    }
  
};
</script>

<style>
.chart-container {
    height: calc(99vh - 85px);
    width: 100%;
    /* transition: margin-left 0.28s; */
}
.div1 {
    display: inline-block;
} 
</style>