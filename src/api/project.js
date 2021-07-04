import request from '@/utils/request'
export default{
    getProjectList(repo,page,size){
        return request({
            url: `/api/project/${repo}/getlist/${page}/${size}`,//ES6写法
            method: 'get'
        });
    },

    getFileList(id){
        return request({
            url: `/api/project/getfilelist/${id}`,//ES6写法
            method: 'get'
        });
    },

    search(page,size,keywords){
        return request({
            url: `/api/project/search/${page}/${size}?q=${keywords}`,//ES6写法
            method: 'get',
        });
    },

    createProject(pojo){
        return request({
            url: `/api/project/add`,
            method: 'post',
            data: pojo
        })
    },

    createURL(pojo){
        return request({
            url: `/api/project/uploadfile`,
            method: 'post',
            data: pojo
        })
    },

    saveFile(pojo){
        return request({
            url: `/api/project/savefile`,
            method: 'post',
            data: pojo        })
    },

    updateFile(pojo){
        return request({
            url: `/api/project/updatefile`,
            method: 'post',
            data: pojo        })
    },

    deleteProject(projectId){
        //console.log("js delete this project")
        return request({
            url:`/api/project/${projectId}`,
            method:'delete'
        })
    },

    deleteFiles(projectId,fileName){
        //console.log("js delete files")
        return request({
            url:`/api/project/deletefiles/${projectId}/${fileName}`,
            method:'delete'
        })
    },

    deleteVersion(projectId,fileName,chosenVersion){
        //console.log("js delete this file")
        return request({
            url:`/api/project/deleteversion/${projectId}/${fileName}/${chosenVersion}`,
            method:'delete'
        })
    },

    getUrl(projectId,fileName,chosenVersion){
        return request({
            url: `/api/project/geturl/${projectId}/${fileName}/${chosenVersion}`,
            method: 'get'
        })
    },
} 
