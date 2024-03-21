<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="20" class="table-filter">
          <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>

            <el-form-item prop="monitorId">
              <el-select v-model.trim="listQuery.monitorId" placeholder="摄像机名称">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in cameraList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="datetime">
              <el-date-picker v-model.trim="listQuery.datetime" :editable="false" :clearable="false" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
            <el-form-item>
              <el-tooltip content="重置">
                <el-button icon="el-icon-refresh" @click="resetQuery"/>
              </el-tooltip>
              <el-tooltip content="搜索">
                <el-button icon="el-icon-search" @click="handleFilter"/>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="listLoading" :data="list" stripe size="mini">
      <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
      <el-table-column label="摄像机名称" prop="monitorId" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.monitorId | cameraFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="视频名称" prop="name" align="center"></el-table-column>
      <el-table-column label="开始时间" prop="startTime" align="center"></el-table-column>
      <el-table-column label="结束时间" prop="endTime" align="center"></el-table-column>
      <el-table-column label="时长" prop="length" :formatter="formatter" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip content="播放">
            <el-button icon="el-icon-video-play" class="elbuttondefault" @click="handlePlay(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="title" :visible.sync="dialogPlayVisible" width="55%" :close-on-click-modal="false">
      <video ref="video" class="video" controls>
        <source type="video/mp4">
      </video>
    </el-dialog>
  </div>
</template>

<script>
import { getList, getCameraList } from '@/api/review'
import Pagination from '@/components/Pagination'

let cameraKeyValue = []

export default {
  components: { Pagination },
  filters: {
    cameraFilter(key) {
      return cameraKeyValue[key]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        edgeDeviceId: this.$route.query.edgeDeviceId,
        monitorId: '',
        datetime: '',
        startTime: '',
        endTime: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'start_time',
        order: 'desc'
      },
      dialogPlayVisible: false,
      title: '',
      cameraList: []
    }
  },
  watch: {
    'listQuery.datetime'(val) {
      if (val) {
        this.listQuery.startTime = val[0]
        this.listQuery.endTime = val[1]
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
    },
    dialogFormVisible(val) {
      if (!val && this.$refs['dataForm']) {
        this.$refs['dataForm'].resetFields()
      }
    },
    dialogPlayVisible(val) {
      if (!val) {
        this.title = ''
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      getCameraList().then(response => {
        if (response.success) {
          this.cameraList = response.data
        } else {
          this.cameraList = []
        }
        cameraKeyValue = this.cameraList.reduce((pre, cur) => {
          pre[cur.id] = cur.name
          return pre
        }, {})
        this.getList()
      })
    },
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        if (response.success) {
          this.list = response.data
          this.total = response.totalRowCount
        } else {
          this.list = []
          this.total = 0
        }
        this.listLoading = false
      })
    },
    resetQuery() {
      this.$refs['filterForm'].resetFields()
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    handlePlay(row) {
      this.dialogPlayVisible = true
      this.$nextTick(() => {
        // console.log(row.videoUrl)
        this.title = row.name
        this.$refs['video'].src = row.videoUrl
        this.$refs['video'].play()
      })
    },
    formatter(row, column) {
      if (column.property === 'length') {
        return this.formatTime(row.length)
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

<style lang="scss" scoped>
.video {
  width: 640px;
  height: 360px;
  clear: both;
  display: block;
  margin: auto;
}
</style>
