import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/deviceMode/ModeListPage',
    method: 'get',
    params: params
  })
}
export function saveResource(params) {
  return request({
    url: '/deviceMode/update',
    method: 'post',
    data: params
  })
}

export function deletePartner(params) {
  return request({
    url: '/deviceMode/delete',
    method: 'get',
    params: params
  })
}
