import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/staticRouting/listPage',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/staticRouting/add',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/staticRouting/del',
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
