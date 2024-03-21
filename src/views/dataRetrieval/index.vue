<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="18">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-col>
        <el-col :span="6" align="right">
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="listLoading" :data="list" border style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <p>温度：{{ props.row.Temperature }}</p>
          <p>湿度：{{ props.row.Humidity }}</p>
        </template>
      </el-table-column>
      <el-table-column label="编号" type="index" width="80" align="center" />
      <el-table-column label="设备名称" prop="deviceName" align="center"></el-table-column>
      <el-table-column label="网关名称" prop="agwName" align="center"></el-table-column>
      <el-table-column label="采集时间" prop="created" align="center">
        <template slot-scope="props">
          {{ parseTime(props.row) }}
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'DataRetrieval',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      setTimeout(() => {
        this.list = [
          {
            index: 1,
            deviceName: '温湿度传感器',
            agwName: '5号车间网关',
            Temperature: '28.1',
            Humidity: '66.8'
          },
          {
            index: 2,
            deviceName: '温湿度传感器',
            agwName: '5号车间网关',
            Temperature: '28.1',
            Humidity: '66.8'
          },
          {
            index: 3,
            deviceName: '温湿度传感器',
            agwName: '5号车间网关',
            Temperature: '28.1',
            Humidity: '66.8'
          },
          {
            index: 4,
            deviceName: '温湿度传感器',
            agwName: '5号车间网关',
            Temperature: '28.1',
            Humidity: '66.8'
          },
          {
            index: 5,
            deviceName: '温湿度传感器',
            agwName: '5号车间网关',
            Temperature: '28.1',
            Humidity: '66.8'
          },
          {
            index: 6,
            deviceName: '温湿度传感器',
            agwName: '5号车间网关',
            Temperature: '28.1',
            Humidity: '66.8'
          },
          {
            index: 7,
            deviceName: '温湿度传感器',
            agwName: '5号车间网关',
            Temperature: '28.1',
            Humidity: '66.8'
          },
          {
            index: 8,
            deviceName: '温湿度传感器',
            agwName: '5号车间网关',
            Temperature: '28.1',
            Humidity: '66.8'
          }
        ]
        this.total = this.list.length
        this.listLoading = false
      }, 1.5 * 1000)
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    parseTime(row) {
      const date = new Date()
      date.setSeconds(date.getSeconds() - row.index * 10)
      return parseTime(date)
    }
  }
}
</script>

