import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/ruleController/findConfigIdAndFieldName',
    method: 'get',
    params: params
  })
}
export function saveResource(params) {
  return request({
    url: '/ruleController/add',
    method: 'post',
    data: params
  })
}

export function editResource(params) {
  return request({
    url: '/ruleController/update',
    method: 'post',
    data: params
  })
}

export function deletePartner(params) {
  return request({
    url: '/ruleController/delete',
    method: 'get',
    params: params
  })
}
export function findByTenantId(params) {
  return request({
    url: '/nprofile/findByTenantId',
    method: 'get',
    params: params
  })
}
