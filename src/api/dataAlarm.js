import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/dataAlarm/listPage',
    method: 'get',
    params: params
  })
}

export function updateData(data) {
  return request({
    url: '/dataAlarm/update',
    method: 'post',
    data
  })
}
