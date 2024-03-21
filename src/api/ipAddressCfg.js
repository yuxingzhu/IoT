import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/exportAddress/listPage',
    method: 'get',
    params: params
  })
}
export function saveResource(params) {
  return request({
    url: '/exportAddress/add',
    method: 'post',
    data: params
  })
}
export function updateResource(params) {
  return request({
    url: '/exportAddress/update',
    method: 'post',
    data: params
  })
}

export function deletePartner(params) {
  return request({
    url: '/exportAddress/delete',
    method: 'get',
    params: params
  })
}
