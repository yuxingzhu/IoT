import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/titleConfig/queryById',
    method: 'get',
    params: params
  })
}

export function updateData(data) {
  return request({
    url: '/titleConfig/update',
    method: 'post',
    data
  })
}
export function updateIcon(data) {
  return request({
    url: '/titleConfig/updateIcon',
    method: 'post',
    data
  })
}
export function updateTagview(data) {
  return request({
    url: '/titleConfig/updateTagview',
    method: 'post',
    data
  })
}