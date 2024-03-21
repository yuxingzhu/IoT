import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/monitorAlarm/find',
    method: 'get',
    params: params
  })
}

