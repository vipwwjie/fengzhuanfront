import request from '@/utils/request'
 
export function login(params) {
  return request({
    url: '/user/login',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    },
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
