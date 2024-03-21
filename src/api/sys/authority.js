import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/adminTenantManage/listPage',
    method: 'get',
    params: params
  })
}
export function saveResource(params) {
  return request({
    url: '/adminTenantManage/add',
    method: 'post',
    data: params
  })
}
export function updateResource(params) {
  return request({
    url: '/adminTenantManage/update',
    method: 'post',
    data: params
  })
}

export function deletePartner(params) {
  return request({
    url: '/adminTenantManage/delete',
    method: 'get',
    params: params
  })
}
