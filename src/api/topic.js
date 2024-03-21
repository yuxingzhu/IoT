import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/dcDataTopic/find',
    method: 'get',
    params: params
  })
}

export function createData(data) {
  return request({
    url: '/dcDataTopic/add',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/dcDataTopic/update',
    method: 'post',
    data
  })
}

export function deleteData(topicName) {
  return request({
    url: '/dcDataTopic/delete',
    method: 'get',
    params: { topicName }
  })
}

export function getConsumeList() {
  return request({
    url: '/dcDataConsume/findAll',
    method: 'get'
  })
}
