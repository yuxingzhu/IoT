import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/appInstallRecord/find',
    method: 'get',
    params: params
  })
}

export function deleteData(id) {
  return request({
    url: '/appInstallRecord/delete',
    method: 'get',
    params: { id }
  })
}
