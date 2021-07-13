import request from '@/utils/request'
export default{
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
    
    createTask(pojo){
        return request({
            url: `/task/create`,
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

    getTaskInfo(taskId){
        return request({
            url: `/task/getinfo/${taskId}`,//ES6写法
            method: 'get'
        });
    },
} 
