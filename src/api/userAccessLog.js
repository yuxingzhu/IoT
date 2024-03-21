import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/userAccessLog/find',
    method: 'get',
    params: params
  })
}
