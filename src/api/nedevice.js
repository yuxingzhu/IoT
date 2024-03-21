import request from '@/utils/request2'

export function searchContext(params) {
  return request({
    url: '/feDevice/context',
    method: 'get',
    params: params
  })
}
export function searchContextTest(pathTest, agwId, params) {
  return request({
    url: '/feDevice/context?textTask=' + pathTest + '&agwId=' + agwId,
    method: 'post',
    data: JSON.parse(params)
  })
}

