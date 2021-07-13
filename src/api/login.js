import request from '@/utils/request'

export function login(email, password) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      email,
      password
    }
  })
}

export function signup(pojo){
  return request({
      url: '/signup',
      method: 'post',
      data: pojo
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function updateInfo(pojo){
  return request({
      url: '/user/saveinfo',
      method: 'put',
      data: pojo
  })
}


