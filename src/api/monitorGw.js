import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/monitor/listPage',
    method: 'get',
    params: params
  })
}

export function updateData(data) {
  return request({
    url: '/monitor/update',
    method: 'post',
    data
  })
}
