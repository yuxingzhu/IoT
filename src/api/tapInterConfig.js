import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/TapInterface/get',
    method: 'get',
    params
  })
}

export function updateData(params) {
  return request({
    url: '/TapInterface/save',
    method: 'post',
    data: params
  })
}

export function getNetCard(params) {
  return request({
    url: '/netCard/getList',
    method: 'get',
    params
  })
}

export function getBridge(params) {
  return request({
    url: '/TapInterface/getBridge',
    method: 'get',
    params
  })
}
