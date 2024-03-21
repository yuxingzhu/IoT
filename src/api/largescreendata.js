import zrRequest from '@/utils/zrRequest'
// 1.获取车间编码、车间名称、车间设备数量列表/获取所有指定工厂的所有设备数量
export function getWorkshopInfo(params) {
  return zrRequest({
    url: '/thirdParty/getWorkshopInfo',
    method: 'get',
    params: params
  })
}
// 2.根据故障类型（设备故障、换料、换型、等待）统计数据，统计时段条件数采传值；获取停机总数量、各类型停机数量、各类型停机占比值
export function getDeviceFaultInfo(params) {
  return zrRequest({
    url: '/thirdParty/getDeviceFaultInfo',
    method: 'get',
    params: params
  })
}
// 3.获取停机原因列表（类型、停机时长、停机开始时间、操作人）
export function getDeviceInfo(params) {
  return zrRequest({
    url: '/thirdParty/getDeviceFaultDetailList',
    method: 'get',
    params: params
  })
}
// 4.每日故障关单率：1、工单类型为故障；2、今日凌晨0点开始到晚上24点结束；3、今日关闭工单数/今日新增工单总数*100%
export function getDeviceFaultCloseRatInfo() {
  return zrRequest({
    url: '/thirdParty/getDeviceFaultCloseRatioList',
    method: 'get',
  })
}
// 近七日，每日设备故障总时长（小时）
export function getDeviceFaultDurationInfo() {
  return zrRequest({
    url: '/thirdParty/getDeviceFaultDurationList',
    method: 'get',
  })
}

