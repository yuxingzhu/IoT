import request from '@/utils/request'

export function getList() {
  return request({
    url: '/feEdgeDevice/edgeDeviceByTenamtId',
    method: 'get'
  })
}

export function findDevice() {
  return request({
    url: '/neDevice/findDeviceByTenantId',
    method: 'post'
  })
}



export function edgeDeviceByName(params) {
  return request({
    url: '/feEdgeDevice/edgeDeviceByName?edgeDeviceName= ' + params,
    method: 'get'
  })
}

export function findDeviceByName(params) {
  return request({
    url: '/neDevice/findDeviceByName?deviceName= ' + params,
    method: 'get'
  })
}

export function findReading(params) {
  return request({
    url: '/neDevice/findReading?deviceName= ' + params,
    method: 'get'
  })
}
