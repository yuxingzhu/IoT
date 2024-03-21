import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/dataDevice/findAll',
    method: 'get',
    params: params
  })
}

export function getLineDayData(params) {
  return request({
    url: '/dataDevice/getLineDayData',
    method: 'get',
    params: params
  })
}
