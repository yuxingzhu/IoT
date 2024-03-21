import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/neDevice/listPageDevice',
    method: 'get',
    params: params
  })
}

export function findList(params) {
  return request({
    url: '/neDevice/findFile',
    method: 'get',
    params: params
  })
}

export function changeAdminStatus(params) {
  return request({
    url: '/neDevice/changeAdminStatus',
    method: 'get',
    params: params
  })
}
export function initParameterList() {
  return request({
    url: '/neDevice/init',
    method: 'get'
  })
}
export function find(params) {
  return request({
    url: '/neDevice/findFile',
    method: 'get',
    params: params
  })
}
export function saveFeDeviceAddress(params) {
  return request({
    url: '/neDevice/add',
    method: 'post',
    data: params
  })
}

export function editFeDeviceAddress(params) {
  return request({
    url: '/neDevice/update',
    method: 'post',
    data: params
  })
}
export function deletePartner(params) {
  return request({
    url: '/neDevice/delete',
    method: 'get',
    params: params
  })
}

export function loadAllMode(params) {
  return request({
    url: '/deviceMode/findMode',
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
export function findFile(params) {
  return request({
    url: '/nprofile/getProfile',
    method: 'get',
    params: params
  })
}
export function savefeScheduleStrategy(params) {
  return request({
    url: '/neScheduleTask/add',
    method: 'post',
    data: params
  })
}
export function editfeScheduleStrategy(params) {
  return request({
    url: '/neScheduleTask/update',
    method: 'post',
    data: params
  })
}
export function findProfile(params) {
  return request({
    url: '/neDevice/findFile',
    method: 'get',
    params: params
  })
}
export function saveCopyDevice(params) {
  return request({
    url: '/neDevice/copyDevice',
    method: 'post',
    data: params
  })
}
export function saveFeDeviceMode(params) {
  return request({
    url: '/neDevice/addMode',
    method: 'post',
    data: params
  })
}
export function copyModesave(params) {
  return request({
    url: '/neDevice/copyEdgeDevice',
    method: 'post',
    data: params
  })
}
export function openAuditDevice(params) {
  return request({
    url: '/neDevice/getProfileReadName',
    method: 'get',
    params: params
  })
}
export function loadLine(params) {
  return request({
    url: '/neDevice/findLineData',
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

export function initProjectList() {
  return request({
    url: '/projectManage/findByTenantId',
    method: 'get'
  })
}

export function initAgwtList(params) {
  return request({
    url: '/feEdgeDevice/findByTenantId',
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
export function getDataViewList(params) {
  return request({
    url: '/neDeviceDataInformation/listPage',
    method: 'get',
    params: params
  })
}
