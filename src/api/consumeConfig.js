import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/dcDataConsume/find',
    method: 'get',
    params: params
  })
}

export function createData(data) {
  return request({
    url: '/dcDataConsume/add',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/dcDataConsume/update',
    method: 'post',
    data
  })
}

export function deleteData(consumeId) {
  return request({
    url: '/dcDataConsume/delete',
    method: 'get',
    params: { consumeId }
  })
}
