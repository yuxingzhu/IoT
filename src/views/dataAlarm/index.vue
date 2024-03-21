<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="20" class="table-filter">
          <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
            <el-form-item prop="deviceName">
              <el-input v-model.trim="listQuery.deviceName" placeholder="告警设备" />
            </el-form-item>
            <el-form-item prop="datetime">
              <el-date-picker v-model.trim="listQuery.datetime" :editable="false" :clearable="false" type="datetimerange" start-placeholder="告警开始时间" end-placeholder="告警开始时间" value-format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
            <el-form-item>
              <el-tooltip content="重置">
                <el-button icon="el-icon-refresh" @click="resetQuery" />
              </el-tooltip>
              <el-tooltip content="搜索">
                <el-button icon="el-icon-search" @click="handleFilter" />
              </el-tooltip>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="listLoading" :data="list" stripe size="mini">
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column label="告警设备" prop="deviceName" align="center" />
      <el-table-column label="告警信息" prop="alarmInfo" align="center" />
      <el-table-column label="告警时间" prop="alarmStartTime" align="center" />
      <el-table-column label="处理状态" prop="dealStatus" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.dealStatus === false ? 'offline' : 'online'" />
          <span>{{ scope.row.dealStatus===false?'未处理':'已处理' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理描述" prop="dealDesc" align="center" />
      <el-table-column  label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip content="处理">
            <el-button :disabled="scope.row.dealStatus != false" icon="el-icon-edit" @click="handleUpdate(scope.row)" class="elbuttondefault">处理</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="temp" label-width="100px" size="mini" @submit.native.prevent>
        <el-row>
          <el-col>
            <el-form-item label="处理描述" prop="dealDesc">
              <el-input v-model.trim="temp.dealDesc" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getList, updateData } from '@/api/dataAlarm'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        deviceName: '',
        datetime: '',
        startTime: '',
        endTime: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'alarmStartTime',
        order: 'desc'
      },
      temp: {
        dataAlarmId: '',
        dealDesc: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '处理告警信息'
      }
    }
  },
  computed: {
    ...mapGetters(['operationPermission'])
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
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.temp.dataAlarmId = row.dataAlarmId
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateData(this.temp).then(response => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              message: response.message,
              type: 'success',
              duration: this.$store.state.settings.duration
            })
          })
        }
      })
    }
  }
}
</script>
