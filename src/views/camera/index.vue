<template>
  <div class="app-container">
    <el-tabs v-model.trim="activeName">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key"></el-tab-pane>
      <component v-bind:is="activeName"></component>
    </el-tabs>
  </div>
</template>

<script>
import manage from './components/manage'
import review from './components/review'

export default {
  components: {
    manage,
    review
  },
  data() {
    return {
      name: 'Camera',
      edgeDeviceId: '',
      tabMapOptions: [
        { label: '管理', key: 'manage' },
        { label: '回看', key: 'review' }
      ],
      activeName: 'manage'
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
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  }
}
</script>
