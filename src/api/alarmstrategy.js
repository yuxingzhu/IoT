import request from '@/utils/request'
// export function getList(params) {
//   return request({
//     url: '/monitorGwAlarmCfg/find',
//     method: 'get',
//     params: params
//   })
// }

// export function createData(data) {
//   return request({
//     url: '/monitorGwAlarmCfg/add',
//     method: 'post',
//     data
//   })
// }

// export function updateData(data) {
//   return request({
//     url: '/monitorGwAlarmCfg/update',
//     method: 'post',
//     data
//   })
// }

// export function deleteData(id) {
//   return request({
//     url: '/monitorGwAlarmCfg/delete',
//     method: 'get',
//     params: { id }
//   })
// }

export function getDeviceName() {
  return request({
    url: '/neDevice/getDeviceName',
    method: 'get'
  })
}

// export function applyGroup(data) {
//   return request({
//     url: '/monitorGwAlarmCfg/applyGroup',
//     method: 'post',
//     data
//   })
// }
// - 新增/修改数据告警策略
export function addOrUpdateData(data) {
  return request({
    url: '/dataAlarmCfg/addOrUpdate',
    method: 'post',
    data
  })
}
// - 条件查询策略
export function  getList(data) {
  return request({
    url: '/dataAlarmCfg/queryCondition',
    method: 'post',
    data
  })
}
// - 删除策略
export function deleteDataAlarm(id) {
    return request({
      url: '/dataAlarmCfg/deleteDataAlarm',
      method: 'get',
      params: { id }
    })
  }
  // 网关组
  export function findAllByGroupName() {
    return request({
      url: '/groupManage/findAllByGroupName',
      method: 'get',
    })
  }
  // 网关
  export function findAllByEdgeDeviceName() {
    return request({
      url: '/groupManage/findAllByEdgeDeviceName',
      method: 'get',
    })
  }