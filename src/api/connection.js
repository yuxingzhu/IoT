import request from '@/utils/request'
// import request3 from '@/utils/request3'
export function list(deviceNid) {
  return request({
    url: '/ddaconfig/getByDeviceId/' + deviceNid,
    method: 'get'
  })
}

export function findDeviceInfo(deviceNid) {
  return request({
    url: '/neDevice/findDeviceByNid/' + deviceNid,
    method: 'get'
  })
}

export function fetchNid(nid) {
  return request({
    url: '/ddaconfig/getById/' + nid,
    method: 'get'
  })
}

// export function save(data) {
//   return request3({
//     url: '/ddaconfig/save',
//     method: 'post',
//     data
//   })
// }
// const cleanedEndpoint = endpoint.replace('/api', '');

export function deleteNid(nid) {
  return request({
    url: '/ddaconfig/deleteById/' + nid,
    method: 'get'
  })
}

export function deleteAll(params) {
  return request({
    url: '/ddaconfig/deleteAll',
    method: 'get',
    params
  })
}

export function listTag(params) {
  return request({
    url: '/ddaconfig/getTagsByConfigId',
    method: 'get',
    params: params
  })
}

export function fetchTagNid(nid) {
  return request({
    url: '/ddaconfig/getTagById/' + nid,
    method: 'get'
  })
}

export function saveTag(data) {
  return request({
    url: '/ddaconfig/saveTag',
    method: 'post',
    data
  })
}

export function deleteTagNid(nid) {
  return request({
    url: '/ddaconfig/deleteTagById/' + nid,
    method: 'get'
  })
}

export function fetchCommandName(params) {
  return request({
    url: '/ddaconfig/getPropertyByDeviceNid',
    method: 'get',
    params: params
  })
}
export function flushEdgeAgw(params) {
  return request({
    url: '/neDevice/flushEdgeAgw',
    method: 'get',
    params: params
  })
}
export function flushNodeAgw(params) {
  return request({
    url: '/node/flushEdgeAgw',
    method: 'get',
    params: params
  })
}
export function offLIneEdgeAgw(params) {
  return request({
    url: '/neDevice/offLIneEdgeAgw',
    method: 'get',
    params: params
  })
}
export function findTaskByAgwId(params) {
  return request({
    url: '/deployTasksController/findTaskByAgwId',
    method: 'get',
    params: params
  })
}
export function searchContext(params) {
  return request({
    url: '/feDevice/context',
    method: 'get',
    params: params
  })
}
export function searchContextTest(pathTest, params) {
  return request({
    url: '/feDevice/context?textTask=' + pathTest,
    method: 'post',
    data: JSON.parse(params)
  })
}
export function findByNid(params) {
  return request({
    url: '/neDevice/findByNid',
    method: 'get',
    params: params
  })
}
export function queryCommandFieldList(params) {
  return request({
    url: '/nprofile/getCommandName',
    method: 'get',
    params: params
  })
}
export function getProfilePath(params) {
  return request({
    url: '/neDevice/getProfilePath',
    method: 'get',
    params: params
  })
}
export function task(params) {
  return request({
    url: '/neDevice/getAccess',
    method: 'get',
    params: params
  })
}
export function getList(params) {
  return request({
    url: '/deployLogs/listPage',
    method: 'get',
    params: params
  })
}
