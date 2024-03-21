<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="20" class="table-filter">
          <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
            <el-form-item>
              <el-select v-model.trim="listQuery.type">
                <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker v-model.trim="date" :editable="false" :clearable="false" :type="type" :value-format="valueFormat" @change="dateChange" />
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
    <div class="chart-container">
      <chart ref="chart" v-loading="listLoading" width="100%" height="100%" :titleSubtext="titleSubtext" :legendData="legendData" :xAxisData="xAxisData" :series="series" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import echarts from 'echarts'
import { getList } from '@/api/flowMonitor'
import Chart from '@/components/Charts/LineMarker'

export default {
  components: { Chart },
  data() {
    return {
      listLoading: true,
      listQuery: {
        agwId: '',
        type: '',
        startDate: '',
        endDate: ''
      },
      typeList: [
        {
          label: '月',
          value: 'month'
        },
        {
          label: '日',
          value: 'date'
        }
      ],
      dateTypes: {
        month: {
          type: 'monthrange',
          valueFormat: 'yyyy-MM',
          value: [moment().format('YYYY-MM'), moment().format('YYYY-MM')]
        },
        date: {
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd',
          value: [
            moment()
              .subtract(7, 'days')
              .format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD')
          ]
        }
      },
      date: '',
      type: '',
      valueFormat: '',
      titleText: '',
      titleSubtext: '',
      legendData: [],
      xAxisData: [],
      series: []
    }
  },
  watch: {
    'listQuery.type'(val) {
      const dateType = this.dateTypes[val]
      this.type = dateType.type
      this.valueFormat = dateType.valueFormat
      this.date = dateType.value
      this.dateChange(dateType.value)
    }
  },
  created() {
    this.listQuery.agwId = this.$route.query.edgeDeviceId
    this.resetQuery()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        const statDateList = []
        const totalSentFlowList = []
        const totalRecvFlowList = []
        response.data.forEach(item => {
          statDateList.push(item.statDate)
          totalSentFlowList.push(this.unitConversion(item.totalSentFlow))
          totalRecvFlowList.push(this.unitConversion(item.totalRecvFlow))
        })
        this.titleText = ''
        this.titleSubtext = '单位：MB'
        this.legendData = ['发送流量', '接收流量']
        this.xAxisData = statDateList
        this.series = [
          {
            name: '发送流量',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: true,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(137, 189, 27, 0.3)'
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(137, 189, 27, 0)'
                    }
                  ],
                  false
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(137,189,27)',
                borderColor: 'rgba(137,189,2,0.27)',
                borderWidth: 12
              }
            },
            data: totalSentFlowList
          },
          {
            name: '接收流量',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: true,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(0, 136, 212, 0.3)'
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(0, 136, 212, 0)'
                    }
                  ],
                  false
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(0,136,212)',
                borderColor: 'rgba(0,136,212,0.2)',
                borderWidth: 12
              }
            },
            data: totalRecvFlowList
          }
        ]
        this.$nextTick(() => {
          this.$refs.chart.initChart()
        })
        this.listLoading = false
      })
    },
    dateChange(dates) {
      if (dates) {
        this.listQuery.startDate = dates[0]
        this.listQuery.endDate = dates[1]
      }
    },
    resetQuery() {
      this.listQuery.type = this.typeList[1].value
      const dateType = this.dateTypes[this.listQuery.type]
      this.type = dateType.type
      this.valueFormat = dateType.valueFormat
      this.date = dateType.value
      this.dateChange(dateType.value)
    },
    handleFilter() {
      this.getList()
    },
    unitConversion(value) {
      value = value / Math.pow(1024, 2)
      value = value.toFixed(2)
      return value
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 235px);
}
</style>
