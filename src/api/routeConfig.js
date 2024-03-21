import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/messageRouteTopicFilterKey/findByRouteId',
    method: 'get',
    params: params
  })
}
export function saveResource(params) {
  return request({
    url: '/messageRouteTopicFilterKey/add',
    method: 'post',
    data: params
  })
}

export function editResource(params) {
  return request({
    url: '/messageRouteTopicFilterKey/update',
    method: 'post',
    data: params
  })
}

export function deletePartner(params) {
  return request({
    url: '/messageRouteTopicFilterKey/delete',
    method: 'get',
    params: params
  })
}

export function initTagList(params) {
  return request({
    url: '/messageRouteTopicFilterValue/listPage',
    method: 'get',
    params: params
  })
}
export function saveValue(params) {
  return request({
    url: '/messageRouteTopicFilterValue/add',
    method: 'post',
    data: params
  })
}

export function editValue(params) {
  return request({
    url: '/messageRouteTopicFilterValue/update',
    method: 'post',
    data: params
  })
}

export function deleteValuePartner(params) {
  return request({
    url: '/messageRouteTopicFilterValue/delete',
    method: 'get',
    params: params
  })
}
