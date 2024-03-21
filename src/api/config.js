import request from '@/utils/request'

export function flushEdgeAgw(params) {
  return request({
    url: '/neDevice/flushEdgeAgw',
    method: 'get',
    params: params
  })
}
export function flushNodeAgw(params) {
  return request({
    url: '/node/flushEdgeAgw',
    method: 'get',
    params: params
  })
}
export function offLIneEdgeAgw(params) {
  return request({
    url: '/neDevice/offLIneEdgeAgw',
    method: 'get',
    params: params
  })
}
export function findTaskByAgwId(params) {
  return request({
    url: '/deployTasksController/findTaskByAgwId',
    method: 'get',
    params: params
  })
}
export function getList(params) {
  return request({
    url: '/deployLogs/listPage',
    method: 'get',
    params: params
  })
}
