import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/nprofile/listPage',
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

export function editResource(params) {
  return request({
    url: 'ruleController/update',
    method: 'post',
    data: params
  })
}
export function addResource(params) {
  return request({
    url: 'nprofile/add',
    method: 'post',
    data: params
  })
}

export function updateResource(params) {
  return request({
    url: 'nprofile/update',
    method: 'post',
    data: params
  })
}

export function deletePartner(params) {
  return request({
    url: '/nprofile/delete',
    method: 'get',
    params: params
  })
}

export function addDevice(params) {
  return request({
    url: '/nprofile/addNeDevice',
    method: 'post',
    data: params
  })
}

