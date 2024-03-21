<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="20" class="table-filter">
          <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
            <el-form-item prop="appModule">
              <el-input v-model.trim="listQuery.appModule" placeholder="操作模块" />
            </el-form-item>
            <el-form-item prop="datetime">
              <el-date-picker v-model.trim="listQuery.datetime" :editable="false" :clearable="false" type="datetimerange" start-placeholder="日志开始时间" end-placeholder="日志结束时间" value-format="yyyy-MM-dd HH:mm:ss" />
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
      <el-table-column label="操作类型" prop="logTitle" align="center"></el-table-column>
      <el-table-column label="操作模块" prop="appModule" align="center"></el-table-column>
      <el-table-column label="操作人IP地址" prop="clientIpAddr" align="center"></el-table-column>
      <el-table-column label="操作人" prop="realName" align="center"></el-table-column>
      <el-table-column label="操作时间" prop="accessTime" align="center"></el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import moment from 'moment'
import { getList } from '@/api/userAccessLog'
import Pagination from '@/components/Pagination'

const format = 'YYYY-MM-DD HH:mm:ss'
const startTime = moment()
  .subtract(1, 'days')
  .format(format)
const endTime = moment().format(format)

export default {
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        appModule: '',
        datetime: [startTime, endTime],
        startTime: startTime,
        endTime: endTime,
        currentPage: 1,
        pageSize: 10
      }
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
    }
  }
}
</script>
