import request from '@/utils/request'

export function tokento(params) {
  return request({
    url: '/api/check/valid',
    method:'post',
    data:params
  })
}