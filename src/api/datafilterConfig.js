import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/datafilter/listPage',
    method: 'get',
    params: params
  })
}
export function savedataConfig(params) {
  return request({
    url: '/datafilter/add',
    method: 'post',
    data: params
  })
}

export function editdataConfig(params) {
  return request({
    url: '/datafilter/update',
    method: 'post',
    data: params
  })
}
export function deletedataConfig(params) {
  return request({
    url: '/datafilter/delete',
    method: 'get',
    params: params
  })
}

export function loadAllEdgeDevice() {
  return request({
    url: '/feEdgeDevice/userEdgeDeviceList',
    method: 'get'
  })
}
export function sendToEdgeDevice(params) {
  return request({
    url: '/datafilter/sendJsons',
    method: 'get',
    params: params
  })
}
export function getHistory(params) {
  return request({
    url: '/datafilter/historyListPage',
    method: 'get',
    params: params
  })
}
