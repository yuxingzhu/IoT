import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/eventRecords/find',
    method: 'get',
    params: params
  })
}

export function getCameraList() {
  return request({
    url: '/camera/findAll',
    method: 'get'
  })
}
