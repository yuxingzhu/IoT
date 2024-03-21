import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/* Layout */
// import Layout from '@/layout'
// import { asyncRoutes } from '@/api/resource'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
const componentsMap = {
  monitorGwAlarmCfg: () => import('@/views/monitorGwAlarmCfg/index'),
  monitorGw: () => import('@/views/monitorGw/index'),
  monitorServiceAlarm: () => import('@/views/monitorServiceAlarm/index'),
  alarmSendConfig: () => import('@/views/alarmSendConfig/index'),
  edgeDevice: () => import('@/views/edgeDevice/index'),
  networkalarm: () => import('@/views/networkalarm/index'),
  consumeConfig: () => import('@/views/consumeConfig/index'),
  topic: () => import('@/views/topic/index'),
  datafilterConfig: () => import('@/views/datafilterConfig/index'),
  appStore: () => import('@/views/appStore/index'),
  userCfg: () => import('@/views/sys/user/index'),
  deviceProfile: () => import('@/views/deviceProfile/index'),
  dataRetrieval: () => import('@/views/dataRetrieval/index'),
  serviceOrch: () => import('@/views/serviceOrch/index'),
  model: () => import('@/views/model/index'),
  authority: () => import('@/views/sys/authority/index'),
  roleCfg: () => import('@/views/sys/role/index'),
  userAccessLog: () => import('@/views/userAccessLog/index'),
  resourceCfg: () => import('@/views/sys/resource/index'),
  connection: () => import('@/views/connection/index'),
  group: () => import('@/views/group/index'),
  mac: () => import('@/views/mac/index'),
  dataSummary: () => import('@/views/dataSummary/index'),
  authentication: () => import('@/views/authentication/index'),
  top: () => import('@/views/top/index'),
  visual: () => import('@/views/visual/index'),
  version: () => import('@/views/sys/version/index'),
  engine: () => import('@/views/engine/index'),
  route: () => import('@/views/route/index'),
  routeConfig: () => import('@/views/routeConfig/index'),
  node: () => import('@/views/node/index'),
  consume: () => import('@/views/consume/index'),
  ipAddressCfg: () => import('@/views/ipAddressCfg/index'),
  offlineAlarm: () => import('@/views/offlineAlarm/index'),
  gatewayType: () => import('@/views/gatewayType/index'),
  authorizationManage: () => import('@/views/authorizationManage/index'),
  monitorAlarm: () => import('@/views/monitorAlarm/index'),
  overall: () => import('@/views/overall/index'),
  dataDisplay: () => import('@/views/dataDisplay/index'),
  dataBoard: () => import('@/views/dataBoard/index'),
  datakanbanData: () => import('@/views/datakanbanData/index'),
  realtimekanban: () => import('@/views/realtimekanban/index'),
  projectManage: () => import('@/views/projectManage/index'),
  dataAlarm: () => import('@/views/dataAlarm/index'),
  deviceResource: () => import('@/views/deviceResource/index'),
  deviceTimeRecord: () => import('@/views/deviceTimeRecord/index'),
  alarmstrategy: () => import('@/views/alarmstrategy/index'),
  warningmessage: () => import('@/views/warningmessage/index'),
}
export const constantRoutes = [
  // {
  //   path:"/",
  //   redirect:"/edgeDevice"
  // },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
     path: '/dashboard',
      name: '首页',
     component: () => import('@/views/dashboard/index'),
     meta: { title: '首页', icon: 'dashboard' }
  },
  // {
  //   path: '/iframe',
  //   name: 'Iframe',
  //   component: () => import('@/views/iframeurl/index'),
  //   meta: {
  //     isRouter: true,
  //     iframeUrl: 'http://192.168.1.1/'
  //   }
  // },
  {
    path: '/largescreen',
    name: 'largescreen',
    component: () => import('@/views/largescreen/index'),
  },
  { 

      path: '/edgeDevice',
      name: '网关管理',
      component: componentsMap.edgeDevice,
      meta: { title: '网管管理', icon: '' },
  },
        {
          path: '/config',
          name: '配置',
          component: () => import('@/views/config/index'),
          meta: { title: '配置', isChildren: true },
          hidden: true
        },
        {
          path: '/gatewayConfig',
          name: '网关配置',
          component: () => import('@/views/gatewayConfig/index'),
          meta: { title: '网关配置', isChildren: true },
          hidden: true
        },
        {
          path: '/monitor',
          name: '监控',
          component: () => import('@/views/monitor/index'),
          meta: { title: '监控', isChildren: true },
          hidden: true
        },
        {
          path: '/connection',
          name: '连接',
          component: () => import('@/views/connection/index'),
          meta: { title: '连接', isChildren: true },
          hidden: true
        },
        {
          path: '/camera',
          name: '摄像机',
          component: () => import('@/views/camera/index'),
          meta: { title: '摄像机', isChildren: true },
          hidden: true
        },
        {
          path: '/openDataView',
          name: '查看数据',
          component: () => import('@/views/openDataView/index'),
          meta: { title: '查看数据', isChildren: true },
          hidden: true
        },
    
 
    {
      path: '/group',
      name: '网关分组',
      component: componentsMap.group,
      meta: { title: '网关分组', icon: '' }
    },
    {
      path: '/deviceResource',
      name: '设备列表',
      component: componentsMap.deviceResource,
      meta: { title: '设备列表', icon: '' }
    },
    {
      path: '/deviceProfile',
      name: '数据模型',
      component: componentsMap.deviceProfile,
      meta: { title: '数据模型', icon: '' },
    },
    {
      path: '/alarmstrategy',
      name: '数据告警策略',
      component: componentsMap.alarmstrategy,
      meta: { title: '数据告警策略', icon: '' }
    },
    {
      path: '/warningmessage',
      name: '数据告警管理',
      component: componentsMap.warningmessage,
      meta: { title: '数据告警管理', icon: '' },
    },
    {
       path: '/resources',
       name: '资源属性',
      component: () => import('@/views/resources/index'),
     meta: { title: '资源属性', isChildren: true },
       hidden: true
    },
    {
      path: '/authorizationManage',
      name: '授权码管理',
      component: componentsMap.authorizationManage,
      meta: { title: '授权码管理', icon: '' }
    },

    {
      path: '/model',
      name: '设备模板',
      component: componentsMap.model,
      meta: { title: '设备模板', icon: '' }
    },
    {
      path: '/topology',
      name: '网络拓扑',
      component: componentsMap.topology,
      meta: { title: '网络拓扑', icon: '' }
    },
    {
      path: '/gateway',
      name: '项目管理',
      component: componentsMap.projectManage,
      meta: { title: '项目管理', icon: '' }
    },
    {
      path: '/deviceTimeRecord',
      name: '设备运行时长',
      component: componentsMap.deviceTimeRecord,
      meta: { title: '设备运行时长', icon: '' }
    },
  
  {
      path: '/monitorGwAlarmCfg',
      name: '告警策略',
      component: componentsMap.monitorGwAlarmCfg,
      meta: { title: '告警策略', icon: '' },
    },
    {
      path: '/monitorGw',
      name: '网关告警',
      component: componentsMap.monitorGw,
      meta: { title: '网关告警', icon: '' }
    },
    {
      path: '/alarmSendConfig',
      name: '发送配置',
      component: componentsMap.alarmSendConfig,
      meta: { title: '发送配置', icon: '' }
    },
    {
      path: '/monitorServiceAlarm',
      name: '服务告警',
      component: componentsMap.monitorServiceAlarm,
      meta: { title: '服务告警', icon: '' }
    },
    {
      path: '/offlineAlarm',
      name: '网关离线告警',
      component: componentsMap.offlineAlarm,
      meta: { title: '网关离线告警', icon: '' }
    },
    {
      path: '/monitorAlarm',
      name: '设备离线告警',
      component: componentsMap.monitorAlarm,
      meta: { title: '设备离线告警', icon: '' }
    },
  {
      path: '/appstore',
      name: '应用',
      component: componentsMap.appStore,
      meta: { title: '应用', icon: '' },
  },
  {
          path: '/filterConfig',
          name: '策略配置',
          component: () => import('@/views/filterConfig/index'),
          meta: { title: '策略配置', isChildren: true },
          hidden: true
  },
  {
      path: '/authentication',
      name: '接入认证',
      component: componentsMap.authentication,
      meta: { title: '接入认证', icon: '' },
    },
    {
      path: '/consume',
      name: '消费配置',
      component: componentsMap.consume,
      meta: { title: '消费配置', icon: '' },
    },
    {
      path: '/ipAddressCfg',
      name: '接入平台',
      component: componentsMap.ipAddressCfg,
      meta: { title: '接入平台', icon: '' },
    },

  {
      path: '/dataBoard',
      name: '数据看板配置',
      component: componentsMap.dataBoard,
      meta: { title: '数据看板配置', icon: '' },
    },
    {
      path: '/datakanbanData',
      name: '数据看板',
      component: componentsMap.datakanbanData,
      meta: { title: '数据看板', icon: '' },
    },
    {
      path: '/realtimekanban',
      name: '实时看板',
      component: componentsMap.realtimekanban,
      meta: { title: '实时看板', icon: '' },
    },

  {

      path: '/mac',
      name: '接入认证',
      component: componentsMap.mac,
      meta: { title: '接入认证', icon: '' },
    }, {
      path: '/userAccessLog',
      name: '日志管理',
      component: componentsMap.userAccessLog,
      meta: { title: '日志管理', icon: '' },
    }, {
      path: '/sys/gatewayType',
      name: '网关型号管理',
      component: componentsMap.gatewayType,
      meta: { title: '网关型号管理', icon: '' },
    },
    {
      path: '/overall',
      name: '系统主题配置',
      component: componentsMap.overall,
      meta: { title: '系统主题配置', icon: '' },
    },
    {
      path: '/configs',
      name: '配置',
      component: () => import('@/views/config/index'),
      meta: { title: '配置', isChildren: true },
      hidden: true
    },
    {
      path: '/connections',
      name: '连接',
      component: () => import('@/views/connection/index'),
      meta: { title: '连接', isChildren: true },
      hidden: true
    },
    {
      path: '/config',
      name: '配置',
      component: () => import('@/views/config/index'),
      meta: { title: '配置', isChildren: true },
      hidden: true
    },
    {
      path: '/gatewayConfig',
      name: '网关配置',
      component: () => import('@/views/gatewayConfig/index'),
      meta: { title: '网关配置', isChildren: true },
      hidden: true
    },
    {
      path: '/monitor',
      name: '监控',
      component: () => import('@/views/monitor/index'),
      meta: { title: '监控', isChildren: true },
      hidden: true
    },
    {
      path: '/connection',
      name: '连接',
      component: () => import('@/views/connection/index'),
      meta: { title: '连接', isChildren: true },
      hidden: true
    },
    {
      path: '/camera',
      name: '摄像机',
      component: () => import('@/views/camera/index'),
      meta: { title: '摄像机', isChildren: true },
      hidden: true
    },
    {
      path: '/openDataView',
      name: '查看数据',
      component: () => import('@/views/openDataView/index'),
      meta: { title: '查看数据', isChildren: true },
      hidden: true
    },
    {
      path: '/filterConfig',
      name: '策略配置',
      component: () => import('@/views/filterConfig/index'),
      meta: { title: '策略配置', isChildren: true },
      hidden: true
    },
    {
      path: '/appversion',
      name: '版本管理',
      component: () => import('@/views/appVersion/index'),
      meta: { title: '版本管理', isChildren: true },
      hidden: true
    },
      {
        path: '/consumeConfigViews',
        name: '消费数据展示',
        component: () => import('@/views/consumeConfigView/index'),
        meta: { title: '消费数据展示', isChildren: true },
        hidden: true
      },


      {
        path: '/resources',
        name: '资源属性',
        component: () => import('@/views/resources/index'),
        meta: { title: '资源属性', isChildren: true },
        hidden: true
      },
      {
        path: '/routeConfig',
        name: '路由配置',
        component: () => import('@/views/routeConfig/index'),
        meta: { title: '路由配置', isChildren: true },
        hidden: true
      },
      {
        path: '/connModel',
        name: '模板信息',
        component: () => import('@/views/connModel/index'),
        meta: { title: '模板信息', isChildren: true },
        hidden: true
      },
      {
        path: '/dataGroup',
        name: '数据组配置',
        component: () => import('@/views/dataGroup/index'),
        meta: { title: '数据组配置', isChildren: true },
        hidden: true
      },
      {
        path: '/dataConfig',
        name: '实时数据配置',
        component: () => import('@/views/dataConfig/index'),
        meta: { title: '实时数据配置', isChildren: true },
        hidden: true
      },
      {
        path: '/dataDevice',
        name: '设备配置',
        component: () => import('@/views/dataConfig/index'),
        meta: { title: '设备配置', isChildren: true },
        hidden: true
      },
      {
        path: '/dataDetails',
        name: '数据详情',
        component: () => import('@/views/dataDetails/index'),
        meta: { title: '数据详情', isChildren: true },
        hidden: true
      },
      {
        path: '/dataDisplay',
        name: '实时数据详情',
        component: () => import('@/views/dataDisplay/index'),
        meta: { title: '实时数据详情', isChildren: true },
        hidden: true
      }
]
const createRouter = () => new Router({
  mode: 'hash', // require service support history
  base: process.env.VUE_APP_NAME.replace(/\\|\//g, ''),
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
const router = createRouter()
export default router
