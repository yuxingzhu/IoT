import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/serviceMonitor/find',
    method: 'get',
    params: params
  })
}
