import request from '@/utils/request'

export function fetchInfoList(params) {
  return request({
    url: '/serviceMonitor/alarm-info',
    method: 'get',
    params: params
  })
}

export function fetchDeviceList(params) {
  return request({
    url: '/monitor/agwAlarm-info',
    method: 'get',
    params: params
  })
}

export function fetchDailyList() {
  return request({
    url: '/feDevice/dailyDataCollection',
    method: 'get'
  })
}

export function fetchLatestList(params) {
  return request({
    url: '/serviceMonitor/latest-list',
    method: 'get',
    params: params
  })
}

export function fetchDeviceCountList() {
  return request({
    url: '/deviceCount',
    method: 'get'
  })
}

export function fetchLineList() {
  return request({
    url: '/lineChart',
    method: 'get'
  })
}

export function fetchMapList() {
  return request({
    url: '/map',
    method: 'get'
  })
}

export function fetchNewList() {
  return request({
    url: '/feDevice/countNewDevice',
    method: 'get'
  })
}

