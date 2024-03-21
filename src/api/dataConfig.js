import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/dataDevice/dataDeviceConfigList',
    method: 'get',
    params: params
  })
}

export function userEdgeDeviceList(params) {
    return request({
      url: '/feEdgeDevice/userEdgeDeviceList',
      method: 'get',
      params: params
    })
}

export function getNeDeviceList(params) {
    return request({
        url: '/neDevice/findNeDeviceByAgwId',
        method: 'get',
        params
    })
}

export function getNeDeviceResouecesList(params) {
    return request({
        url: '/neDeviceResources/findDeviceResources',
        method: 'get',
        params
    })
}

export function saveRoleResourceConfig(data) {
  return request({
      url: '/dataDevice/saveDataDevice',
      method: 'post',
      data
  })
}

export function deleteDataDevice(id) {
  return request({
      url: '/dataDevice/deleteDataDevice',
      method: 'get',
    params: { id }
  })
}