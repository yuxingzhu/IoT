import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/feServiceOrchManage/serviceOrchPage',
    method: 'get',
    params: params
  })
}
export function saveResource(params) {
  return request({
    url: '/feServiceOrchManage/add',
    method: 'post',
    data: params
  })
}

export function editResource(params) {
  return request({
    url: '/feServiceOrchManage/updateFeServiceOrch',
    method: 'post',
    data: params
  })
}

export function deletePartner(params) {
  return request({
    url: '/feServiceOrchManage/delete',
    method: 'get',
    params: params
  })
}
export function findSrc(params) {
  return request({
    url: '/assignManage/findSrc',
    method: 'get',
    params: params
  })
}
export function loadAllFeEdgeGroupList(params) {
  return request({
    url: '/groupManage/findAll',
    method: 'get',
    params: params
  })
}
export function loadfeEdgeDeviceList(params) {
  return request({
    url: '/feEdgeDevice/userEdgeDevice',
    method: 'get',
    params: params
  })
}

export function saveAssign(params) {
  return request({
    url: '/assignManage/addOrUpdate',
    method: 'post',
    data: params
  })
}

export function findAssginList(params) {
  return request({
    url: '/assignManage/findName',
    method: 'get',
    params: params
  })
}
