import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/containerMonitor/getContainerList',
    method: 'get',
    params: params
  })
}

export function getContainerStatus(ip, containerId, state) {
  return request({
    url: '/containerMonitor/getContainerStatus',
    method: 'get',
    params: { ip, containerId, state }
  })
}

export function startContainer(ip, containerId) {
  return request({
    url: '/containerMonitor/startContainer',
    method: 'get',
    params: { ip, containerId }
  })
}

export function stopContainer(ip, containerId) {
  return request({
    url: '/containerMonitor/stopContainer',
    method: 'get',
    params: { ip, containerId }
  })
}

export function restartContainer(ip, containerId) {
  return request({
    url: '/containerMonitor/restartContainer',
    method: 'get',
    params: { ip, containerId }
  })
}
