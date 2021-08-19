import request from '@/utils/request'
export default{
    getWorkersList(){
        return request({
            url: `/admin/getworkerslist`,
            method: 'get'
        });
    },

    getPrivateWorkersList(){
        return request({
            url: `/admin/getprivateworkerslist`,
            method: 'get'
        });
    },

    getUsersList(){
        return request({
            url: `/admin/getuserslist`,
            method: 'get'
        });
    },

    addWorker(userId,workerId){
        return request({
            url: `/admin/worker/${userId}`, //ES6写法
            method: 'post',
            data: {workerId}       
        })
    },

    delWorker(userId,workerId){
        return request({
            url: `/admin/worker/${userId}`, //ES6写法
            method: 'delete',
            data: {workerId}       
        })
    },

} 
