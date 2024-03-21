import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/versionManage/find',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/versionManage/add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/versionManage/update',
    method: 'post',
    data
  })
}

export function deleteId(params) {
  return request({
    url: '/versionManage/delete',
    method: 'get',
    params: params
  })
}

export function uploadFile(file) {
  return request({
    url: '/ddaconfig/deleteById',
    method: 'post',
    file
  })
}

export function downloadFile() {
  return request({
    url: '/ddaconfig/deleteById',
    method: 'get'
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
    url: '/versionManage/updateVersion',
    method: 'get',
    params: params
  })
}
