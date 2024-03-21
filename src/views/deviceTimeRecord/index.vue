<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-row>
          <el-col :span="24" class="table-filter">
            <el-row>
              <el-col :span="24" class="table-filter">
                <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
                  <el-form-item prop="deviceName">
                    <el-input v-model.trim="listQuery.deviceName" placeholder="设备名称" />
                  </el-form-item>
                  <el-form-item prop="agwId">
                    <el-select v-model.trim="listQuery.agwId" placeholder="所属网关">
                      <el-option v-for="item in egwList" :key="item.edgeDeviceId" :label="item.edgeDeviceName" :value="item.edgeDeviceId" />
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="datetime">
                    <el-date-picker v-model.trim="listQuery.datetime" :editable="false" :clearable="false" type="daterange" start-placeholder="记录时间" end-placeholder="记录时间" value-format="yyyy-MM-dd HH:mm:ss" />
                  </el-form-item>
                  <el-form-item>
                    <el-tooltip content="重置">
                      <el-button icon="el-icon-refresh" @click="resetQuery" />
                    </el-tooltip>
                    <el-tooltip content="搜索">
                      <el-button icon="el-icon-search" @click="handleFilter"/>
                    </el-tooltip>
                    <el-tooltip content="导出数据">
                      <el-button @click="onload" style="border-radius: 10px;" icon="el-icon-download"/>
                    </el-tooltip>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <el-table ref="multipleTable" v-loading="listLoading" :data="list" stripe size="mini" tooltip-effect="dark" style="width: 100%;">
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="设备名称" prop="deviceName" align="center" />
        <el-table-column label="在线时长" prop="durationShow" align="center" />
        <el-table-column label="记录时间" prop="recordTime" align="center" />
        <el-table-column label="所属网关" prop="edgeDeviceName" align="center" />
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
    </div>
    <router-view />
  </div>
</template>

<script>
import {
  getList
} from '@/api/deviceTimeRecord'
import Pagination from '@/components/Pagination'
import { loadAllEdgeDevice } from '@/api/datafilterConfig'
import { mapGetters } from 'vuex' // secondary package based on el-pagination

export default {
  name: 'DeviceTimeRecord',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        agwId: '',
        datetime: '',
        startTime: '',
        endTime: '',
        deviceName: '',
        currentPage: 1,
        pageSize: 10,
        orderBy: 'insertTime',
        order: 'desc'
      },
      egwList: []
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
    this.initData()
    this.getList()
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  methods: {
    onload() {
      let size = this.listQuery.pageSize;
      this.listQuery.pageSize = 1000000;
      getList(this.listQuery).then((response) => {
      this.listQuery.pageSize = 10;
        if (response.success) {
          let arrs = [];
          arrs = response.data;
          arrs.map((el, index) => {
            el.index = index / 1 + 1;
          })
          this.$nextTick(() => {
            this.exportExcel(arrs);
          });
        }
      });
    },
    exportExcel(arr) {
      require.ensure([], () => {
        const {export_json_to_excel} = require("../../Excel/Export2Excel"); //注意这个Export2Excel路径
        const tHeader = [
          "序号",
          "设备名称",
          "在线时长",
          "记录时间",
          "所属网关",
        ]; // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "index",
          "deviceName",
          "durationShow",
          "recordTime",
          "edgeDeviceName"
        ]; // 上面的index、nickName、name是tableData里对象的属性key值
        const list1 = arr; //把要导出的数据tableData存到list
        const data = this.formatJson(filterVal, list1);
        export_json_to_excel(tHeader, data, "设备运行时长列表"); //最后一个是表名字
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    initData() {
      loadAllEdgeDevice().then(response => {
        if (response.success) {
          this.egwList = response.data
          // console.log(this.egwList,"this.egwList")
        } else {
          this.list = []
        }
      })
    },
    getList() {
      this.listLoading = true
      getList(this.listQuery).then((response) => {
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
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    resetQuery() {
      this.listQuery = {
        agwId: '',
        datetime: '',
        startTime: '',
        endTime: '',
        deviceName: '',
        currentPage: 1,
        pageSize: 10,
        orderBy: 'insertTime',
        order: 'desc'
      }
    }
  }
}
</script>
