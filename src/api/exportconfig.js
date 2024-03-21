import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/neExportRegist/listPage',
    method: 'get',
    params: params
  })
}
export function saveResource(params) {
  return request({
    url: '/neExportRegist/add',
    method: 'post',
    data: params
  })
}
export function updateResource(params) {
  return request({
    url: '/neExportRegist/update',
    method: 'post',
    data: params
  })
}

export function deletePartner(params) {
  return request({
    url: '/neExportRegist/delete',
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
export function queryCommandFieldList(params) {
  return request({
    url: '/nprofile/getProfileName',
    method: 'get',
    params: params
  })
}
export function findAllTopic() {
  return request({
    url: '/neExportRegist/findAllTopic',
    method: 'get'
  })
}

export function getKey() {
  return request({
    url: '/authentication/find',
    method: 'get'
  })
}

export function getExportAddress() {
  return request({
    url: '/exportAddress/findAll',
    method: 'get'
  })
}
