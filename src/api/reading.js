import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/reading/find',
    method: 'get',
    params: params
  })
}

export function countExport(params) {
  return request({
    url: '/reading/countExport',
    method: 'get',
    params: params
  })
}
