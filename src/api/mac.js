import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/mac/list',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/mac/save',
    method: 'post',
    data
  })
}

export function deleteId(id) {
  return request({
    url: '/mac/del',
    method: 'get',
    params: { id }
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

