import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'login/submit',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}
