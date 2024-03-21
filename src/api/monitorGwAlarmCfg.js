import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/monitorGwAlarmCfg/find',
    method: 'get',
    params: params
  })
}

export function createData(data) {
  return request({
    url: '/monitorGwAlarmCfg/add',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/monitorGwAlarmCfg/update',
    method: 'post',
    data
  })
}

export function deleteData(alarmCfgId) {
  return request({
    url: '/monitorGwAlarmCfg/delete',
    method: 'get',
    params: { alarmCfgId }
  })
}

export function getGroup() {
  return request({
    url: '/groupManage/find',
    method: 'get'
  })
}

export function applyGroup(data) {
  return request({
    url: '/monitorGwAlarmCfg/applyGroup',
    method: 'post',
    data
  })
}
