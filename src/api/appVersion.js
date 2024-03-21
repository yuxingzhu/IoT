import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/appVersion/find',
    method: 'get',
    params: params
  })
}

export function createData(data) {
  return request({
    url: '/appVersion/add',
    method: 'post',
    data
  })
}

export function deleteData(versionId) {
  return request({
    url: '/appVersion/delete',
    method: 'get',
    params: { versionId }
  })
}

export function findEgwInfo() {
  return request({
    url: '/appInstallRecord/findEgwInfo',
    method: 'get'
  })
}

export function findByVersionId(versionId) {
  return request({
    url: '/appInstallRecord/findByVersionId',
    method: 'get',
    params: { versionId }
  })
}

export function install(data) {
  return request({
    url: '/appInstallRecord/add',
    method: 'post',
    data
  })
}
