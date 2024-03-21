import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/consume/find',
    method: 'get',
    params: params
  })
}

export function createData(data) {
  return request({
    url: '/consume/add',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/consume/update',
    method: 'post',
    data
  })
}

export function deleteData(consumeId) {
  return request({
    url: '/consume/delete',
    method: 'get',
    params: { consumeId }
  })
}
