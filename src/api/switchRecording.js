import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/timeRecord/find',
    method: 'get',
    params: params
  })
}
