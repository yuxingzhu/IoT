import request from '@/utils/request'

export function fetchNeicList() {
  return request({
    url: '/top/findNeic',
    method: 'get'
  })
}

export function fetchCpuList() {
  return request({
    url: '/top/findCpu',
    method: 'get'
  })
}

export function fetchShebList() {
  return request({
    url: '/top/findSheb',
    method: 'get'
  })
}

export function fetchDataList() {
  return request({
    url: '/top/find',
    method: 'get'
  })
}
