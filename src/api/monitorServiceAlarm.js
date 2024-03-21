import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/serviceMonitorAlarm/find',
    method: 'get',
    params: params
  })
}

