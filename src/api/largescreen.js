import request from '@/utils/request'
export function getPerformance() {
  return request({
    url: '/modem/getPerformance',
    method: 'get',
  })
}
export function getLastPerformance() {
  return request({
    url: '/modem/getLastPerformance',
    method: 'get',
  })
}
// 设备总览
export function countOn() {
  return request({
    url: '/neDevice/countOnlineAndOffline',
    method: 'get',
  })
}
// 网关总览
export function gatewaysource() {
  return request({
    url: '/feEdgeDevice/gatewayOverview',
    method: 'get',
  })
}
// 设备运行时长
export function findAllResource() {
  return request({
    url: '/neDeviceInfo/findAllByDay',
    method: 'get',
  })
}
// 网关告警
export function listPagePartner(params) {
  return request({
    url: '/monitor/listPage',
    method: 'get',
    params: params
  })
}
