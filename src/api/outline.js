import request from '@/utils/request'

export function fetchList(deviceId) {
  return request({
    url: '/egwMonitorInfo/summary',
    method: 'get',
    params: { deviceId }
  })
}
export function getHistory(params) {
  return request({
    url: '/feEdgeVersion/findPage',
    method: 'get',
    params: params
  })
}
