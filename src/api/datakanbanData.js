import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/dataBoardAndDetails/find',
    method: 'get',
    params: params
  })
}

export function getDetailsList(params) {
  return request({
    url: '/dataBoardAndDetails/findDetails',
    method: 'get',
    params: params
  })
}
