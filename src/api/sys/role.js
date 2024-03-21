import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/roleManage/roleList',
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
    url: '/roleManage/add',
    method: 'post',
    data: params
  })
}
export function editFeDeviceAddress(params) {
  return request({
    url: '/roleManage/updateRole',
    method: 'post',
    data: params
  })
}

export function deletePartner(params) {
  return request({
    url: '/roleManage/delete',
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

