import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/authorizationManagement/find',
    method: 'get',
    params: params
  })
}

export function createData(data) {
  return request({
    url: '/authorizationManagement/add',
    method: 'post',
    data
  })
}

export function deleteData(id) {
  return request({
    url: '/authorizationManagement/delete',
    method: 'get',
    params: { id }
  })
}

