<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list.slice((listQuery.currentPage-1)*listQuery.pageSize,listQuery.currentPage*listQuery.pageSize)" stripe size="mini">
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column label="容器名称" prop="Names" :formatter="nameFormatter" align="center" />
      <el-table-column label="CPU使用率" prop="cpuPercent" align="center" />
      <el-table-column label="内存使用" prop="memoryUsage" align="center" />
      <el-table-column label="容器状态" prop="State" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.State === 'exited' ? 'offline' : 'online'" />
          <span>{{ stateFormatter(scope.row.State) }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip content="启动">
            <el-button :disabled="scope.row.State == 'running'" icon="el-icon-video-play" @click="startContainer(scope.row)" />
          </el-tooltip>
          <el-tooltip content="停止">
            <el-button :disabled="scope.row.State == 'exited'" icon="el-icon-switch-button" @click="stopContainer(scope.row)" />
          </el-tooltip>
          <el-tooltip content="重新启动">
            <el-button icon="el-icon-refresh-left" @click="restartContainer(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination 
      background
       @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.currentPage"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="text-align: right;padding: 32px 0 0 16px;" />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import { findById } from '@/api/edgeDevice'
import {
  getList,
  getContainerStatus,
  startContainer,
  stopContainer,
  restartContainer
} from '@/api/containerMonitor'

export default {
  components: { Pagination },
  filters: {
    stateFilter(state) {
      const stateMap = {
        running: 'success',
        created: 'info',
        exited: 'danger'
      }
      return stateMap[state]
    }
  },
  data() {
    return {
      edgeDeviceId: this.$route.query.edgeDeviceId,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        ip: '',
        all: 1,
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      },
      stateMap: {
        running: '运行中',
        created: '已创建',
        exited: '已停止'
      },
      background: {
        type: Boolean,
        default: true
      }
    }
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  created() {
    this.findById()
  },
  methods: {
    findById() {
      findById(this.edgeDeviceId).then((response) => {
        if (response.success) {
          this.listQuery.ip = response.data.ipAddress
          this.getList()
        }
      })
    },
    getList() {
      this.listLoading = true
      getList(this.listQuery).then((response) => {
        if (response.success) {
          response.data.forEach((item, index) => {
            item.index = index
            if (item.State === 'running') {
              item.cpuPercent = '加载中'
              item.memoryUsage = '加载中'
              this.getContainerStatus(item.Id, item.State, index)
            } else {
              item.cpuPercent = 'N/A'
              item.memoryUsage = 'N/A'
            }
          })
          this.list = response.data
          this.total = response.totalRowCount
        } else {
          this.list = []
          this.total = 0
        }
        this.listLoading = false
      })
    },
    getContainerStatus(containerId, state, index) {
      getContainerStatus(this.listQuery.ip, containerId, state).then(
        (response) => {
          if (response.success) {
            this.list[index].cpuPercent = response.cpuPercent
            this.list[index].memoryUsage = response.memoryUsage
          }
        }
      )
    },
    nameFormatter(row, column, cellValue, index) {
      return cellValue[0].substring(1, cellValue[0].length)
    },
    stateFormatter(cellValue) {
      return this.stateMap[cellValue]
    },
    startContainer(row) {
      if (!this.listLoading) {
        this.listLoading = true
        startContainer(this.listQuery.ip, row.Id).then((response) => {
          if (response.success) {
            this.$notify({
              message: response.message,
              type: 'success'
            })
            row.State = 'running'
            this.getContainerStatus(row.Id, row.State, row.index)
          }
          this.listLoading = false
        })
      }
    },
    stopContainer(row) {
      if (!this.listLoading) {
        this.listLoading = true
        stopContainer(this.listQuery.ip, row.Id).then((response) => {
          if (response.success) {
            this.$notify({
              message: response.message,
              type: 'success'
            })
            row.State = 'exited'
            row.cpuPercent = 'N/A'
            row.memoryUsage = 'N/A'
          }
          this.listLoading = false
        })
      }
    },
    restartContainer(row) {
      if (!this.listLoading) {
        this.listLoading = true
        restartContainer(this.listQuery.ip, row.Id).then((response) => {
          if (response.success) {
            this.$notify({
              message: response.message,
              type: 'success'
            })
            row.State = 'running'
            this.getContainerStatus(row.Id, row.State, row.index)
          }
          this.listLoading = false
        })
      }
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.currentPage = val
    }
  }
}
</script>
