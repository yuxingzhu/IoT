import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/deviceTimeRecord/listPage',
    method: 'get',
    params: params
  })
}

