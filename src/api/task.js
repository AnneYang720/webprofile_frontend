import request from '@/utils/request'
export default{
    getWorkerInfo(chosenWorker){
        return request({
            url: `/getworkinfo/${chosenWorker}`,
            method: 'get'
        })
    },
    
    getMyWorkersList(){
        return request({
            url: `/getmyworkerslist`,
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
    
    getTasksList(page,size){
        return request({
            url: `/task/getlist/${page}/${size}`,//ES6写法
            method: 'get'
        });
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

    getFailInfoUrl(taskId){
        return request({
            url: `/task/getfailinfo/${taskId}`,//ES6写法
            method: 'get'
        });
    },
} 
