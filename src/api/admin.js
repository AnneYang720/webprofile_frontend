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
            method: 'delete',
            data: workerId       
        })
    },

} 
