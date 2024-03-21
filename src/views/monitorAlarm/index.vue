<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="24" class="table-filter">
          <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
     
                <el-form-item prop="deviceName">
                  <el-input v-model.trim="listQuery.deviceName" placeholder="设备名称" />
                </el-form-item>
          
                <el-form-item prop="agwId">
                  <el-select v-model.trim="listQuery.agwId" placeholder="告警网关">
                    <el-option v-for="item in egwList" :key="item.id" :label="item.edgeDeviceName" :value="item.edgeDeviceId" />
                  </el-select>
                </el-form-item>
    
                <el-form-item prop="datetime">
                  <el-date-picker v-model.trim="listQuery.datetime" :editable="false" :clearable="false" type="datetimerange" start-placeholder="告警开始时间" end-placeholder="告警开始时间" value-format="yyyy-MM-dd HH:mm:ss" />
                </el-form-item>
           
                <el-form-item prop="alarmInfo">
                <el-input v-model.trim="listQuery.alarmInfo" placeholder="设备告警信息关键字"></el-input>
               </el-form-item>
                <el-form-item>
                  <el-tooltip content="重置">
                    <el-button icon="el-icon-refresh" @click="resetQuery" />
                  </el-tooltip>
                  <el-tooltip content="搜索">
                    <el-button icon="el-icon-search" @click="handleFilter" />
                  </el-tooltip>
                  <el-tooltip content="导出">
                <el-button   icon="el-icon-download" @click="onload"/>
              </el-tooltip>
                </el-form-item>
         
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-tabs v-model.trim="listQuery.alarmStatus" @tab-click="handleClick">
      <el-tab-pane v-for="item in alarmStatusList" :key="item.name" :label="item.label" :name="item.name" />
    </el-tabs>
    <el-table v-loading="listLoading" :data="list" stripe size="mini">
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column label="设备名称" prop="deviceName" align="center" />
      <el-table-column label="告警开始时间" prop="_alarmTime" align="center" />
      <div v-if="listQuery.alarmStatus ==='false'">
        <el-table-column label="告警结束时间" prop="_alarmEndTime" align="center" />
      </div>
      <el-table-column label="告警信息" prop="alarmInfo" align="center" />
      <el-table-column label="告警时长" prop="alarmDate" align="center" />
      <el-table-column label="告警网关" prop="edgeDeviceName" align="center" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { getList } from '@/api/monitorAlarm'
import { loadAllEdgeDevice } from '@/api/datafilterConfig'
import Pagination from '@/components/Pagination'

const alarmStatusList = [
  {
    label: '当前告警',
    name: 'true'
  },
  {
    label: '历史告警',
    name: 'false'
  }
]

export default {
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        agwId: '',
        datetime: '',
        startAlarmTime: '',
        endAlarmTime: '',
        deviceName: '',
        alarmStatus: alarmStatusList[0].name,
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc',
        alarmInfo:''
      },
      egwList: [],
      alarmStatusList: alarmStatusList
    }
  },
  watch: {
    'listQuery.datetime'(val) {
      if (val) {
        this.listQuery.startAlarmTime = val[0]
        this.listQuery.endAlarmTime = val[1]
      } else {
        this.listQuery.startAlarmTime = ''
        this.listQuery.endAlarmTime = ''
      }
    }
  },
  created() {
    this.initData()
    this.getList()
  },
  methods: {
    onload() {
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
        const { export_json_to_excel } = require("../../Excel/Export2Excel"); //注意这个Export2Excel路径
        const tHeader = [
          "序号",
          "设备名称",
          "告警开始时间",
          "告警信息",
          "告警时长",
          "告警网关",
        ]; // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "index",
          "deviceName",
          "_alarmTime",
          "alarmInfo",
          "alarmDate",
          "edgeDeviceName"

        ]; // 上面的index、nickName、name是tableData里对象的属性key值
        const list1 = arr; //把要导出的数据tableData存到list
        const data = this.formatJson(filterVal, list1);
        export_json_to_excel(tHeader, data, "网关告警"); //最后一个是表名字
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    initData() {
      loadAllEdgeDevice().then(response => {
        if (response.success) {
          this.egwList = response.data
        } else {
          this.list = []
        }
      })
    },
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        // console.log(response)
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
    handleClick(tab, event) {
      this.listQuery.currentPage = 1
      this.getList()
    }
  }
}
</script>
<style>
.el-button--default{
  border-radius: 5px !important;
}
.elbuttondefault{
  background: #ffffff !important;
  color: #000000 !important;
}
#app .el-button--small {
    border-radius: 0px;
    padding: 9px 9px;
}
</style>