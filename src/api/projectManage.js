import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/projectManage/findAllProject',
    method: 'get',
    params: params
  })
}
export function saveResource(params) {
  return request({
    url: '/projectManage/add',
    method: 'post',
    data: params
  })
}
export function updateResource(params) {
  return request({
    url: '/projectManage/update',
    method: 'post',
    data: params
  })
}

export function deletePartner(params) {
  return request({
    url: '/projectManage/delete',
    method: 'get',
    params: params
  })
}
