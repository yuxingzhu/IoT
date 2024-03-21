<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="20" class="table-filter">
          <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="导出" placement="bottom">
                <el-button icon="el-icon-download" @click="countExport" :disabled="this.total === 0" />
              </el-tooltip>
            </el-form-item>
            <el-form-item prop="deviceName">
              <el-input v-model.trim="listQuery.deviceName" placeholder="设备名称" />
            </el-form-item>
            <el-form-item prop="datetime">
              <el-date-picker v-model.trim="listQuery.datetime" :editable="false" :clearable="false" type="datetimerange" start-placeholder="采集开始时间" end-placeholder="采集结束时间" value-format="yyyy-MM-dd HH:mm:ss" />
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
      <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
      <el-table-column label="设备名称" prop="deviceName" align="center"></el-table-column>
      <el-table-column label="MAC地址" prop="macAddr" align="center"></el-table-column>
      <el-table-column label="采集时间" prop="createTime" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip content="详情">
            <el-button icon="el-icon-magic-stick" class="elbuttondefault" @click="handleView(scope.row)"  />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :visible.sync="readingsDialogVisible" width="40%">
      <span class="el-dialog__title" slot="title"><i class="el-icon-fa-th-large"></i>数据详情</span>
      <div>
        <el-table :data="readingsList" :max-height="500" empty-text="暂无数据">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="属性名称" prop="name" align="center"></el-table-column>
          <el-table-column label="属性描述" prop="description" align="center"></el-table-column>
          <el-table-column label="数值" prop="value" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <div slot="footer"></div>
  </div>
</template>

<script>
import { getList, countExport } from '@/api/reading'
import Pagination from '@/components/Pagination'
import moment from 'moment'

export default {
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        collectionName: this.$route.query.collectionName,
        deviceName: '',
        datetime: '',
        startTime: '',
        endTime: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      },
      readingsList: '',
      dialogFormVisible: false,
      readingsDialogVisible: false,
      length: [],
      params: {
        collectionName: '',
        deviceName: '',
        startTime: '',
        endTime: ''
      },
      historyTitle: '导出异常详情',
      fieldQueryTotal: 0,
      tableData: [],
      showHistoryDialog: false,
      fieldQuering: false,
      loadingFieldList: false,
      names: [],
      equals: false,
      loadings: ''
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
          this.total = response.totalRowCount ? response.totalRowCount : 0
        } else {
          this.list = []
          this.total = 0
        }
        this.listLoading = false
      })
    },
    dowloadFile() {
      const exportUrl =
        process.env.VUE_APP_BASE_API +
        '/reading/export?collectionName=' +
        this.listQuery.collectionName +
        '&deviceName=' +
        this.listQuery.deviceName +
        '&startTime=' +
        this.listQuery.startTime +
        '&endTime=' +
        this.listQuery.endTime
      window.open(exportUrl)
    },
    dowloadFileFilter() {
      const exportUrl =
        process.env.VUE_APP_BASE_API +
        '/reading/exportFilter?collectionName=' +
        this.listQuery.collectionName +
        '&deviceName=' +
        this.listQuery.deviceName +
        '&startTime=' +
        this.listQuery.startTime +
        '&endTime=' +
        this.listQuery.endTime +
        '&names=' +
        this.names
      window.open(exportUrl)
    },
    countExport() {
      this.loadings = this.$loading({
        lock: true,
        text: '正在导出...',
        fontSize: '100px',
        spinner: 'el-icon-loading',
        spinnerColor: 'red',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.params.collectionName = this.listQuery.collectionName
      this.params.deviceName = this.listQuery.deviceName
      this.params.startTime = this.listQuery.startTime
      this.params.endTime = this.listQuery.endTime
      countExport(this.params)
        .then(response => {
          if (response.success) {
            this.loadings.close()
            this.dowloadFile()
          } else {
            this.loadings.close()
            this.$notify.error({
              title: '错误',
              message: response.message
            })
          }
          this.loadings.close()
          this.loadingFieldList = false
        })
        .catch(error => {
          this.loadings.close()
          console.log(error)
        })
    },
    closeHistoryDialog() {
      this.showHistoryDialog = false
      if (!this.equals) {
        this.$confirm('请确认是否继续导出其他设备?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.dowloadFileFilter()
          })
          .catch(() => {})
      }
    },
    resetQuery() {
      this.$refs['filterForm'].resetFields()
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    handleDowloadFile: function() {
      this.dowloadFile()
    },
    startDateChange: function(date) {
      let startDate = ''
      const endDate = this.listQuery.endTime
      if (
        date &&
        endDate &&
        moment(date).valueOf() > moment(endDate).valueOf()
      ) {
        this.$alert('开始时间不能大于结束时间', '提示')
      } else {
        startDate = moment(date).format('YYYY-MM-DD') + ' 00:00:00'
      }
      this.listQuery.startTime = startDate
    },
    endDateChange: function(date) {
      const startDate = this.listQuery.startTime
      let endDate = ''
      if (
        date &&
        startDate &&
        moment(date).valueOf() < moment(startDate).valueOf()
      ) {
        this.$alert('结束时间不能小于开始时间', '提示')
      } else {
        endDate = moment(date).format('YYYY-MM-DD') + ' 23:59:59'
      }
      this.listQuery.endTime = endDate
    },
    handleView(row) {
      this.readingsList = row.readingList
      this.readingsDialogVisible = true
    }
  }
}
</script>
<style>
.el-loading-spinner .el-loading-text {
  color: #00c3c4 !important;
  margin: 3px 0;
  font-size: 14px;
}
.el-loading-spinner i {
  color: #00c3c4 !important;
}
</style>

<style lang="scss" scoped>
.param-border {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

/deep/ .el-upload {
  width: 100%;
}

/deep/ .el-upload-dragger {
  width: 100%;
}
</style>
