import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/alarmSendConfig/find',
    method: 'get',
    params: params
  })
}

export function createData(data) {
  return request({
    url: '/alarmSendConfig/add',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/alarmSendConfig/update',
    method: 'post',
    data
  })
}

export function deleteData(configId) {
  return request({
    url: '/alarmSendConfig/delete',
    method: 'get',
    params: { configId }
  })
}

export function getUserList() {
  return request({
    url: '/account/find',
    method: 'get'
  })
}