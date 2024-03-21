import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/neCacheConfig/findCache',
    method: 'get',
    params: params
  })
}
export function updateData(params) {
  return request({
    url: '/neCacheConfig/updateCache',
    method: 'get',
    params: params
  })
}
