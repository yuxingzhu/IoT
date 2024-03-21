import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/messageRouteConfig/listPage',
    method: 'get',
    params: params
  })
}
export function saveResource(params) {
  return request({
    url: '/messageRouteConfig/addUpload',
    method: 'post',
    data: params
  })
}

export function editResource(params) {
  return request({
    url: 'messageRouteConfig/update',
    method: 'post',
    data: params
  })
}
export function addResource(params) {
  return request({
    url: 'messageRouteConfig/add',
    method: 'post',
    data: params
  })
}

export function updateResource(params) {
  return request({
    url: 'messageRouteConfig/update',
    method: 'post',
    data: params
  })
}

export function deletePartner(params) {
  return request({
    url: '/messageRouteConfig/delete',
    method: 'get',
    params: params
  })
}
