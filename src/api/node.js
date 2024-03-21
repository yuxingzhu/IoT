import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/node/listPage',
    method: 'get',
    params: params
  })
}
export function saveResource(params) {
  return request({
    url: '/nprofile/addUpload',
    method: 'post',
    data: params
  })
}

export function addResource(params) {
  return request({
    url: 'node/add',
    method: 'post',
    data: params
  })
}

export function updateResource(params) {
  return request({
    url: 'node/update',
    method: 'post',
    data: params
  })
}

export function deletePartner(params) {
  return request({
    url: '/node/delete',
    method: 'get',
    params: params
  })
}
export function deleteLocal(params) {
  return request({
    url: '/node/deleteLocal',
    method: 'get',
    params: params
  })
}
