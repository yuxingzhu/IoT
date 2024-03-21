import request from '@/utils/request'

export function getList() {
  return request({
    url: '/authentication/find',
    method: 'get'
  })
}

export function getRandomSecretKey() {
  return request({
    url: '/authentication/getSecretKey',
    method: 'get'
  })
}

export function createData(secretKey) {
  return request({
    url: '/authentication/updateSecretKey',
    method: 'get',
    params: { secretKey }
  })
}
