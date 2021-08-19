import request from '@/utils/request'
export default{
    getWorkersList(){
        return request({
            url: `/admin/getworkerslist`,//ES6写法
            method: 'get'
        });
    },

    getUsersList(){
        return request({
            url: `/admin/getuserslist`,//ES6写法
            method: 'get'
        });
    },

    addWorker(userId,workerId){
        return request({
            url: `/admin/addworker/${userId}`,
            method: 'post',
            data: workerId       
        })
    },

    delWorker(userId,workerId){
        return request({
            url: `/admin/delworker/${userId}`,
            method: 'post',
            data: workerId       
        })
    },





    getVList(chosenPlatform){
        return request({
            url: `/task/getvlist/${chosenPlatform}`,
            method: 'get'
        })
    },
    
    getPlatformList(){
        return request({
            url: `/task/getplatform`,//ES6写法
            method: 'get'
        });
    },
    
    createTaskUrl(pojo){
        return request({
            url: `/task/createurl`,
            method: 'post',
            data: pojo
        })
    },

    saveTaskInfo(pojo){
        return request({
            url: `/task/savetaskinfo`,
            method: 'post',
            data: pojo       
        })
    },
    


    getTasksId(){
        return request({
            url: `/task/getidlist`,//ES6写法
            method: 'get'
        });
    },

    taskProfile(pojo){
        return request({
            url: `/task/taskprofile`,//ES6写法
            method: 'post',
            data: pojo
        });
    },

    netVisualize(taskId){
        return request({
            url: `/task/netvisualize/${taskId}`,//ES6写法
            method: 'get'
        });
    },
} 
