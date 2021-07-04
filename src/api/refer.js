import request from '@/utils/request'
export default{
    getReferList(repo,page,size){
        return request({
            url: `/api/refer/${repo}/getlist/${page}/${size}`,//ES6写法
            method: 'get'
        });
    },


    search(page,size,keywords){
        return request({
            url: `/api/refer/search/${page}/${size}?q=${keywords}`,//ES6写法
            method: 'get',
        });
    },

    // createProject(pojo){
    //     return request({
    //         url: `/project/add`,
    //         method: 'post',
    //         data: pojo
    //     })
    // },

    createURL(pojo){
        return request({
            url: `/api/refer/uploadrefer`,
            method: 'post',
            data: pojo
        })
    },

    saveRefer(pojo){
        return request({
            url: `/api/refer/saverefer`,
            method: 'post',
            data: pojo        })
    },

    updateRefer(pojo){
        return request({
            url: `/api/refer/updaterefer`,
            method: 'post',
            data: pojo        })
    },

    deleteRefer(referId){
        //console.log("js delete this project")
        return request({
            url:`/api/refer/${referId}/`,
            method:'delete'
        })
    },

    getUrl(referId,userId){
        return request({
            url: `/api/refer/geturl/${userId}/${referId}/`,
            method: 'get'
        })
    },
} 
