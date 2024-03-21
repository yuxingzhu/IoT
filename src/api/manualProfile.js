import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/nprofile/getProfiles',
    method: 'get',
    params: params
  })
}
export function saveResource(params) {
  return request({
    url: '/nprofile/addUpload',
    method: 'post',
    data: params
  })
}

export function editResource(params) {
  return request({
    url: 'ruleController/update',
    method: 'post',
    data: params
  })
}

export function deletePartner(params) {
  return request({
    url: '/nprofile/deleteProfileByNId',
    method: 'get',
    params: params
  })
}
