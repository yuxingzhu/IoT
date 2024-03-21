import request from '@/utils/request'

export function fetchHugeList() {
  return request({
    url: '/dataSummary/hugeData/list',
    method: 'get'
  })
}

export function fetchDeviceList(params) {
  return request({
    url: '/dataSummary/devicePie/list',
    method: 'get',
    params: params
  })
}

export function fetchServiceList(params) {
  return request({
    url: '/dataSummary/servicePie/list',
    method: 'get',
    params: params
  })
}

export function fetchAlarmList(params) {
  return request({
    url: '/dataSummary/alarmPie/list',
    method: 'get',
    params: params
  })
}

export function fetchDataList(dataType) {
  return request({
    url: '/dataSummary/dataBar/list',
    method: 'get',
    params: { dataType }
  })
}
