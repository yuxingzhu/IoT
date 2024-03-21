import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/dhcpConfig/listpage',
    method: 'get',
    params: params
  })
}
export function updateData(params) {
  return request({
    url: '/dhcpConfig/update',
    method: 'post',
    data: params
  })
}

export function deleteData(params) {
  return request({
    url: '/dhcpConfig/delete',
    method: 'post',
    params: params
  })
}
