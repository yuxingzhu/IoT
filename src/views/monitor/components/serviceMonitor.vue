<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="20" class="table-filter">
          <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
            <el-form-item>
            </el-form-item>
            <el-form-item prop="serviceStatus">
              <el-select v-model.trim="listQuery.serviceStatus" placeholder="服务状态">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in serviceStatusList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-tooltip content="重置">
                <el-button icon="el-icon-refresh" @click="resetQuery"></el-button>
              </el-tooltip>
              <el-tooltip content="搜索">
                <el-button icon="el-icon-search" @click="handleFilter"></el-button>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="listLoading" :data="list" stripe size="mini">
      <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
      <el-table-column label="服务名称" prop="serviceName" align="center"></el-table-column>
      <el-table-column label="简介" prop="serviceAliasName" align="center"></el-table-column>
      <el-table-column label="检查时间" prop="reportTime" align="center"></el-table-column>
      <el-table-column label="服务状态" prop="serviceStatus" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.serviceStatus ? 'online' : 'offline'" />
          <span>{{ scope.row.serviceStatus | serviceStatusFilter }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { getList } from '@/api/serviceMonitor'
import Pagination from '@/components/Pagination'

const serviceStatusList = [
  {
    value: true,
    label: '运行中'
  },
  {
    value: false,
    label: '已停止'
  }
]

const serviceStatusKeyValue = formatterList(serviceStatusList)

function formatterList(list) {
  return list.reduce((pre, cur) => {
    pre[cur.value] = cur.label
    return pre
  }, {})
}

export default {
  components: { Pagination },
  filters: {
    serviceStatusFilter(key) {
      return serviceStatusKeyValue[key]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        agwId: this.$route.query.edgeDeviceId,
        serviceName: '',
        serviceAliasName: '',
        serviceStatus: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      },
      serviceStatusList: serviceStatusList
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
          this.total = []
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
