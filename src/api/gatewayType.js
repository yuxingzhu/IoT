import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/gatewayType/findAll',
    method: 'get',
    params: params
  })
}
export function saveResource(params) {
  return request({
    url: '/gatewayType/saveData',
    method: 'post',
    data: params
  })
}

export function deletePartner(params) {
  return request({
    url: '/gatewayType/deleteData/' + params,
    method: 'post'
  })
}
