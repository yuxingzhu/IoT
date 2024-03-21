import request from '@/utils/request'
import sxRequest from '@/utils/sxRequest'
import FileRequest from "@/utils/fileRequest";

export function getList(params) {
  return request({
    url: '/feEdgeDevice/deviceTenantList',
    method: 'get',
    params: params
  })
}

export function querySearchAsync(params) {
  return request({
    url: '/feEdgeDevice/area',
    method: 'get',
    params: params
  })
}

export function findById(edgeDeviceId) {
  return request({
    url: '/feEdgeDevice/findById',
    method: 'get',
    params: { edgeDeviceId }
  })
}

export function saveFeDeviceAddress(params) {
  return request({
    url: '/feEdgeDevice/add',
    method: 'post',
    data: params
  })
}
export function updateCode(params) {
  return request({
    url: '/feEdgeDevice/updateCode',
    method: 'post',
    data: params
  })
}
export function editFeDeviceAddress(params) {
  return request({
    url: '/feEdgeDevice/updateFeEdgeDevice',
    method: 'post',
    data: params
  })
}
export function updateFeEdgeIsDeteled(params) {
  return request({
    url: '/feEdgeDevice/updateFeEdgeIsDeteled',
    method: 'post',
    data: params
  })
}
export function deletePartner(params) {
  return request({
    url: '/feEdgeDevice/delete',
    method: 'get',
    params: params
  })
}
export function deleteLocal(params) {
  return request({
    url: '/feEdgeDevice/deleteLocal',
    method: 'get',
    params: params
  })
}
export function removeFilter(params) {
  return request({
    url: '/feEdgeDevice/removeFilter',
    method: 'get',
    params: params
  })
}
export function findAllVersion() {
  return request({
    url: '/versionManage/findAllVersion',
    method: 'post'
  })
}

export function getHistory(params) {
  return request({
    url: '/feEdgeVersion/findPage',
    method: 'get',
    params: params
  })
}
export function getDetail(params) {
  return request({
    url: '/dfaDatafilterDetail/find',
    method: 'get',
    params: params
  })
}

export function getAll(params) {
  return request({
    url: '/gatewayType/getAll',
    method: 'get',
    params: params
  })
}

export function getProjectList() {
  return request({
    url: '/projectManage/findByTenantId',
    method: 'get'
  })
}
// 筛选接口
export function gatway() {
  return request({
    url: '/feEdgeDevice/getGatewayType',
    method: 'get'
  })
}
// 排序接口
export function dictionarysort(params) {
  return request({
    url: '/feEdgeDevice/deviceTenantList',
    method: 'get',
    params: params
  })
}
// 下载模版地
export function download() {
  return FileRequest({
    url: '/feEdgeDevice/downloadTemplate',
    method: 'get',
    responseType: 'blob',
  })
}
// 批量导入
export function batchimport(params) {
  return request({
    url: '/feEdgeDevice/importTemplate',
    method: 'post',
    data: params
  })
}

// 心跳（四信）
export function heartBeat(params) {
  return sxRequest({
    url: '/modem/heartbeat',
    method: 'get',
    params: params
  })
}

// 网关列表
export function feEdgeDeviceStatus(params) {
  return request({
    url: '/feEdgeDevice/status',
    method: 'get',
    params: params
  })
}

