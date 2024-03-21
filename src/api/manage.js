import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/camera/find',
    method: 'get',
    params: params
  })
}

export function createData(data) {
  return request({
    url: '/camera/add',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/camera/update',
    method: 'post',
    data
  })
}

export function deleteData(id, edgeDeviceId) {
  return request({
    url: '/camera/delete',
    method: 'get',
    params: { id, edgeDeviceId }
  })
}

export function getPlayUrl(id, edgeDeviceId) {
  return request({
    url: '/camera/getPlayUrl',
    method: 'get',
    params: { id, edgeDeviceId }
  })
}
