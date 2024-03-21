import request from '@/utils/request'

export function list(ModelId) {
  return request({
    url: '/connModel/getByModelId/' + ModelId,
    method: 'get'
  })
}

export function findDeviceInfo(modeId) {
  return request({
    url: '/deviceMode/findById/' + modeId,
    method: 'get'
  })
}

export function save(data) {
  return request({
    url: '/connModel/save',
    method: 'post',
    data
  })
}

export function deleteNid(nid) {
  return request({
    url: '/connModel/deleteById/' + nid,
    method: 'get'
  })
}

export function deleteAll(params) {
  return request({
    url: '/connModel/deleteAll',
    method: 'get',
    params
  })
}

export function listTag(params) {
  return request({
    url: '/connModel/getTagsByConfigId',
    method: 'get',
    params: params
  })
}

export function saveTag(data) {
  return request({
    url: '/connModel/saveTag',
    method: 'post',
    data
  })
}

export function deleteTagNid(id) {
  return request({
    url: '/connModel/deleteTagById/' + id,
    method: 'get'
  })
}

export function fetchCommandName(params) {
  return request({
    url: '/connModel/getPropertyByDeviceNid',
    method: 'get',
    params: params
  })
}
