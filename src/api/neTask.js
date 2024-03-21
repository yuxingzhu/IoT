import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/neTask/listPage',
    method: 'get',
    params: params
  })
}

export function findDeviceList(params) {
  return request({
    url: '/neTask/findDeviceList',
    method: 'get',
    params: params
  })
}

export function findDeviceListExcludeId(params) {
  return request({
    url: '/neTask/findDeviceListExcludeId',
    method: 'get',
    params: params
  })
}

export function saveResource(params) {
  return request({
    url: '/neTask/addNeTask',
    method: 'post',
    data: params
  })
}
export function updateResource(params) {
  return request({
    url: '/neTask/updateNeTask',
    method: 'post',
    data: params
  })
}

export function deletePartner(params) {
  return request({
    url: '/neTask/delete',
    method: 'get',
    params: params
  })
}

