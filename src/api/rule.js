import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/neRuleEngine/listPage',
    method: 'get',
    params: params
  })
}
export function saveResource(params) {
  return request({
    url: '/neRuleEngine/add',
    method: 'post',
    data: params
  })
}
export function updateResource(params) {
  return request({
    url: '/neRuleEngine/update',
    method: 'post',
    data: params
  })
}

export function deletePartner(params) {
  return request({
    url: '/neRuleEngine/delete',
    method: 'get',
    params: params
  })
}
export function queryDeviceList(params) {
  return request({
    url: '/neDevice/findNeDeviceByAgwId',
    method: 'get',
    params: params
  })
}
export function queryReadFieldList(params) {
  return request({
    url: '/neDevice/findReadName',
    method: 'get',
    params: params
  })
}
export function queryWriteFieldList(params) {
  return request({
    url: '/neDevice/findWriteName',
    method: 'get',
    params: params
  })
}
export function queryCommandFieldList(params) {
  return request({
    url: '/nprofile/getProfileCommandName',
    method: 'get',
    params: params
  })
}
export function tenantEdgeDevice() {
  return request({
    url: '/feEdgeDevice/tenantEdgeDevice',
    method: 'get'
  })
}
export function findNeDeviceByAgwId(params) {
  return request({
    url: '/neDevice/findNeDeviceByAgwId',
    method: 'get',
    params: params
  })
}

