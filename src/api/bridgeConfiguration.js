import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/bridgeConfig/listPage',
    method: 'get',
    params: params
  })
}
export function getBridge(params) {
  return request({
    url: '/bridgeConfig/getBridge',
    method: 'get',
    params: params
  })
}
export function saveBridge(params) {
  return request({
    url: '/bridgeConfig/add',
    method: 'post',
    params: params
  })
}

export function deleteData(id, params) {
  return request({
    url: '/bridgeConfig/delete/' + id,
    method: 'post',
    data: params
  })
}

