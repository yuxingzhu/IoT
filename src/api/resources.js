import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/neDeviceResources/listPage',
    method: 'get',
    params: params
  })
}
export function saveResource(params) {
  return request({
    url: '/neDeviceResources/add',
    method: 'post',
    data: params
  })
}

export function editResource(params) {
  return request({
    url: '/neDeviceResources/update',
    method: 'post',
    data: params
  })
}

export function deletePartner(params) {
  return request({
    url: '/neDeviceResources/delete',
    method: 'get',
    params: params
  })
}
