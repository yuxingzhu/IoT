import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/offlineAlarm/find',
    method: 'get',
    params: params
  })
}

