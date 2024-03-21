import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/dataDisplayBoard/listPage',
    method: 'get',
    params: params
  })
}

export function createData(data) {
  return request({
    url: '/dataDisplayBoard/add',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/dataDisplayBoard/update',
    method: 'post',
    data
  })
}

export function deleteData(displayBoardId) {
  return request({
    url: '/dataDisplayBoard/delete',
    method: 'get',
    params: { displayBoardId }
  })
}

export function getUserInfo(displayBoardId) {
  return request({
    url: '/dataDisplayPermission/findUser',
    method: 'get',
    params: { displayBoardId }
  })
}

export function addPermissionList(data) {
  return request({
    url: '/dataDisplayPermission/addPermissionList',
    method: 'post',
    data
  })
}
