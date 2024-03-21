import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/dataGroup/listPage',
    method: 'get',
    params: params
  })
}

export function createData(data) {
  return request({
    url: '/dataGroup/add',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/dataGroup/update',
    method: 'post',
    data
  })
}

export function deleteData(dataGroupId) {
  return request({
    url: '/dataGroup/delete',
    method: 'get',
    params: { dataGroupId }
  })
}

