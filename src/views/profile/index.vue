<template>
  <div class="app-container">
    <el-tabs v-model.trim="activeName">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key"></el-tab-pane>
      <component v-bind:is="activeName"></component>
    </el-tabs>
  </div>
</template>

<script>
import manualProfile from './content/manualProfile'
import deviceProfile from './content/deviceProfile'
import Pagination from '@/components/Pagination'
export default {
  name: 'Profile',
  components: {
    manualProfile,
    deviceProfile,
    Pagination
  },
  data() {
    return {
      tabMapOptions: [
        { label: '手动配置', key: 'manualProfile' },
        { label: '导入配置', key: 'deviceProfile' }
      ],
      activeName: 'manualProfile'
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(
        `${this.$route.path}?tab=${val}`
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
  },
  methods: {}
}
</script>
