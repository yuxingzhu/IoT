import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/appStore/find',
    method: 'get',
    params: params
  })
}

export function createData(data) {
  return request({
    url: '/appStore/add',
    method: 'post',
    data
  })
}

export function deleteData(appId) {
  return request({
    url: '/appStore/delete',
    method: 'get',
    params: { appId }
  })
}
