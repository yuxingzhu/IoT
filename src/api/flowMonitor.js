import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/statGatewayFlow/find',
    method: 'get',
    params: params
  })
}

