<template>
  <div class="app-container">
    <el-tabs v-model.trim="activeName">
      <el-tab-pane
        v-for="item in tabMapOptions"
        :key="item.key"
        :label="item.label"
        :name="item.key"
      ></el-tab-pane>
      <component v-bind:is="activeName"></component>
    </el-tabs>
  </div>
</template>

<script>
import outline from './components/outline'
import flowMonitor from './components/flowMonitor'
import serviceMonitor from './components/serviceMonitor'
import containerMonitor from './components/containerMonitor'
import switchRecording from './components/switchRecording'
import appInstallRecord from './components/appInstallRecord'

export default {
  name: 'Monitor',
  components: {
    outline,
    flowMonitor,
    serviceMonitor,
    containerMonitor,
    switchRecording,
    appInstallRecord
  },
  data() {
    return {
      edgeDeviceId: '',
      tabMapOptions: [
        { label: '概要', key: 'outline' },
        { label: '流量监控', key: 'flowMonitor' },
        { label: '服务监控', key: 'serviceMonitor' },
        // { label: '容器监控', key: 'containerMonitor' },
        { label: '开关机记录', key: 'switchRecording' }
        // { label: '应用安装记录', key: 'appInstallRecord' }
      ],
      activeName: 'outline'
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(
        `${this.$route.path}?tab=${val}&edgeDeviceId=${this.edgeDeviceId}`
      )
    }
  },
  created() {
    this.edgeDeviceId = this.$route.query.edgeDeviceId
    // init the default  selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  }
}
</script>
