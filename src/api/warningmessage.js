import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/dataAlarm/queryCondition',
    method: 'post',
    data
  })
}
export function deleteAlarmData(params) {
    return request({
      url: '/dataAlarm/deleteAlarm',
      method: 'get',
      params: params
    })
  }
  export function dealAlarmData(params) {
    return request({
      url: '/dataAlarm/dealAlarm',
      method: 'get',
      params: params
    })
  }