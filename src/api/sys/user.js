import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/account/listPage',
    method: 'get',
    params: params
  })
}

export function findById(edgeDeviceId) {
  return request({
    url: '/feEdgeDevice/findById',
    method: 'get',
    params: { edgeDeviceId }
  })
}

export function saveFeDeviceAddress(params) {
  return request({
    url: '/account/add',
    method: 'post',
    data: params
  })
}
export function editFeDeviceAddress(params) {
  return request({
    url: '/account/update',
    method: 'post',
    data: params
  })
}

export function deletePartner(params) {
  return request({
    url: '/account/delete',
    method: 'get',
    params: params
  })
}
export function loadAllTenantList(params) {
  return request({
    url: '/adminTenantManage/find',
    method: 'get',
    params: params
  })
}

export function loadAllRoleList(params) {
  return request({
    url: '/roleManage/find',
    method: 'get',
    params: params
  })
}
export function changePasswd(params) {
  return request({
    url: '/account/updatePassword',
    method: 'post',
    data: params
  })
}
export function editPassword(params) {
  return request({
    url: '/account/editPassword',
    method: 'post',
    data: params
  })
}