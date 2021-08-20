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

    addWorker(userId,worker_add){
        return request({
            url: `/admin/worker/${userId}`, //ES6写法
            method: 'post',
            data: {worker_add}       
        })
    },

    delWorker(userId,worker_del){
        return request({
            url: `/admin/worker/${userId}`, //ES6写法
            method: 'delete',
            data: {worker_del}       
        })
    },

    addAdmin(admin_add){
        return request({
            url: `/admin/add`, //ES6写法
            method: 'post',
            data: {admin_add}       
        })
    },

    delAdmin(admin_del){
        return request({
            url: `/admin/del`, //ES6写法
            method: 'delete',
            data: {admin_del}       
        })
    },

    changePwd(pojo){
        return request({
            url: '/admin/changepwd',
            method: 'post',
            data: pojo
        })
    }

} 
