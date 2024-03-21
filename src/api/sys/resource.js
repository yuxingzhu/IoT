import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/resource/list',
    method: 'get',
    params: params
  })
}

export function loadRoleResourceDataList(params) {
  return request({
    url: '/roleManage/loadRoleResources',
    method: 'get',
    params: params
  })
}

export function saveFeDeviceAddress(params) {
  return request({
    url: '/resource/add',
    method: 'post',
    data: params
  })
}
export function editFeDeviceAddress(params) {
  return request({
    url: '/resource/update',
    method: 'post',
    data: params
  })
}

export function deletePartner(params) {
  return request({
    url: '/resource/delete',
    method: 'get',
    params: params
  })
}
export function saveRoleResourceConfig(params) {
  return request({
    url: '/roleManage/configRoleResources',
    method: 'post',
    data: params
  })
}

