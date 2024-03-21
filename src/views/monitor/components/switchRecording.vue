<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" stripe size="mini">
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column label="关机时间" prop="shutdownTime" align="center" />
      <el-table-column label="开机时间" prop="startupTime" align="center" />
      <el-table-column label="关机时长" prop="duration" :formatter="formatter" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/switchRecording'

export default {
  data() {
    return {
      list: [],
      listLoading: true,
      listQuery: {
        edgeDeviceId: this.$route.query.edgeDeviceId
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        if (response.success) {
          this.list = response.data
        } else {
          this.list = []
        }
        this.listLoading = false
      })
    },
    formatter(row, column) {
      if (column.property === 'duration') {
        return this.formatTime(row.duration)
      }
    },
    formatTime(duration) {
      let secondTime = parseInt(duration)
      let minuteTime = 0
      let hourTime = 0
      let dayTime = 0
      if (secondTime > 60) {
        minuteTime = parseInt(secondTime / 60)
        secondTime = parseInt(secondTime % 60)
        if (minuteTime > 60) {
          hourTime = parseInt(minuteTime / 60)
          minuteTime = parseInt(minuteTime % 60)
        }
        if (hourTime > 24) {
          dayTime = parseInt(hourTime / 24)
          hourTime = parseInt(hourTime % 24)
        }
      }
      let result = ''
      if (minuteTime > 0) {
        result = parseInt(minuteTime) + '分钟'
        if (hourTime > 0) {
          result = parseInt(hourTime) + '小时' + result
        }
        if (dayTime > 0) {
          result = parseInt(dayTime) + '天' + result
        }
      } else {
        result = '小于1分钟'
      }
      return result
    }
  }
}
</script>
