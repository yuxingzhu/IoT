import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/groupManage/listPage',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/groupManage/add',
    method: 'post',
    data
  })
}

export function deleteId(groupId) {
  return request({
    url: '/groupManage/delete',
    method: 'get',
    params: { groupId }
  })
}

export function fetchDevices(groupId) {
  return request({
    url: '/feEdgeDevice/allot',
    method: 'get',
    params: { groupId }
  })
}

export function createAllotList(data) {
  return request({
    url: '/groupManage/group',
    method: 'post',
    data
  })
}

