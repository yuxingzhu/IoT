<template>
  <el-row :gutter="10" class="summary" style="background-color: transparent">
    <el-row class="chart" style="height:363px;background-color: rgba(7,21,43,0.58);padding: 15px;">
      <el-form ref="dateForm" v-model.trim="flowQueryForm" :inline="true" label-width="5px" style="height:30px;">
        <el-form-item label="" style="height:35px;margin-bottom:0px;">
          <el-date-picker v-model.trim="flowQueryForm.startDate" :editable="false" :clearable="false" size="small" type="date" placeholder="选择日期" style="width: 100%;" @change="startDateChange" />
        </el-form-item>
        <el-form-item label="" style="height:35px;margin-bottom:0px;">
          <el-date-picker v-model.trim="flowQueryForm.endDate" :editable="false" :clearable="false" size="small" type="date" placeholder="选择时期" style="width: 100%;" @change="endDateChange" />
        </el-form-item>
        <el-form-item label="" style="height:35px;margin-bottom:0px;">
          <el-button type="primary" size="small" @click="queryAll">查询</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10">

        <el-col :span="8">
          <div class="chart" style="height:230px;">
            <div class="header">
              <p class="hex" />
              <span>网关协议统计</span>
            </div>
            <div class="chartArea">
              <div ref="service" class="pie" />
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="chart" style="height:230px">
            <div class="header">
              <p class="hex" />
              <span>网关告警统计</span>
            </div>
            <div class="chartArea">
              <div ref="alarm" class="pie" />
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="chart" style="height:230px">
            <div class="header">
              <p class="hex" />
              <span>网关区域统计</span>
            </div>
            <div class="chartArea">
              <div ref="device" class="pie" />
            </div>
          </div>
        </el-col>
      </el-row>

    </el-row>
    <el-row :gutter="20" style="padding: 10px;">
      <el-col :span="12" style="padding: 10px;background-color: rgba(7,21,43,0.58);height: 380px;">
        <div class="chart">
          <div class="header">
            <i class="el-icon-s-platform" style="color: #a664f7;font-size: 14px;font-size: 14px;" />
            <span>网关数据采集统计</span>
          </div>
          <div class="chartArea">
            <div ref="gateway" class="bar" style="margin-top:-20px;" />
          </div>
        </div>
      </el-col>

      <el-col :span="12" style="background-color: rgba(7,21,43,0.58);border-left:10px solid #1f274e;padding: 10px;">
        <el-row>
          <div class="change">
            <div class="minus">
              <div class="header">
                <i class="el-icon-s-marketing" style="color: #a664f7;font-size: 14px;" />
                <span>数据量剧减</span>
              </div>
              <div class="content">
                <ul>
                  <li v-for="(data,index) in minData" :key="data.deviceName+Math.random().toFixed(5)">
                    <el-row style="color:#7073AB;font-size: 13px">
                      <el-col :span="2">
                        {{ index+1 }}
                      </el-col>
                      <el-col :span="12" style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;" :title="data.deviceName">
                        <span>{{ data.deviceName }}</span>
                      </el-col>
                      <el-col :span="10">
                        <span>{{ data.date }}</span>
                      </el-col>
                    </el-row>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </el-row>
        <el-row>
          <div class="change">
            <div class="add">
              <div class="header">
                <i class="el-icon-s-marketing" style="color: #a664f7;" />
                <span>数据量剧增</span>
              </div>
              <div class="content">
                <ul>
                  <li v-for="(data,index) in maxData" :key="data.deviceName+Math.random().toFixed(5)">
                    <el-row style="color:#7073AB;font-size: 13px">
                      <el-col :span="2">
                        {{ index+1 }}
                      </el-col>
                      <el-col :span="12" style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;" :title="data.deviceName">
                        <span>{{ data.deviceName }}</span>
                      </el-col>
                      <el-col :span="10">
                        <span>{{ data.date }}</span>
                      </el-col>
                    </el-row>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </el-row>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import moment from 'moment'
import { fetchHugeList, fetchDeviceList, fetchServiceList, fetchAlarmList, fetchDataList } from '@/api/dataSummary'
const echarts = require('echarts')
export default {
  name: 'IndexVue',
  data: function() {
    return {
      alarmReportContentList: [],
      maxData: [],
      minData: [],
      flowQueryForm: {
        startDate: '',
        endDate: ''
      }
    }
  },
  mounted: function() {
    this.flowQueryForm.startDate = moment().subtract(30, 'days').format('YYYY-MM-DD')
    this.flowQueryForm.endDate = moment().format('YYYY-MM-DD') + ' 23:59:59'
    this.initPieChart()
    this.initBarChart()
    this.initAlarmReportContentList()
  },
  methods: {
    queryAll: function() {
      this.initPieChart()
    },
    startDateChange: function(date) {
      let startDate = ''
      const endDate = this.flowQueryForm.endDate
      if (date && endDate && moment(date).valueOf() > moment(endDate).valueOf()) {
        this.$alert('开始时间不能大于结束时间', '提示')
        startDate = moment().subtract(30, 'days').format('YYYY-MM-DD')
      } else {
        startDate = moment(date).format('YYYY-MM-DD')
      }
      this.flowQueryForm.startDate = startDate
    },
    endDateChange: function(date) {
      const startDate = this.flowQueryForm.startDate
      let endDate = ''
      if (date && startDate && moment(date).valueOf() < moment(startDate).valueOf()) {
        this.$alert('结束时间不能小于开始时间', '提示')
        endDate = moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59'
      } else {
        endDate = moment(date).format('YYYY-MM-DD') + ' 23:59:59'
      }
      this.flowQueryForm.endDate = endDate
    },
    initAlarmReportContentList: function() {
      const _this = this
      fetchHugeList().then(function(response) {
        if (response.success) {
          _this.maxData = response.max
          _this.minData = response.min
        } else {
          _this.maxData = []
          _this.minData = []
        }
      })
    },
    initPieChart: function() {
      const _this = this
      const params = Object.assign({}, _this.flowQueryForm)
      fetchDeviceList(params).then(function(response) {
        if (response.success) {
          const devicePieChart = echarts.init(_this.$refs.device, 'macarons')
          devicePieChart.setOption(_this.pieDateGenerator(response.legend, response.data))
        }
      })
      fetchServiceList(params).then(function(response) {
        if (response.success) {
          const servicePieChart = echarts.init(_this.$refs.service, 'macarons')
          servicePieChart.setOption(_this.pieDateGenerator(response.legend, response.data))
        }
      })
      fetchAlarmList(params).then(function(response) {
        if (response.success) {
          const alarmPieChart = echarts.init(_this.$refs.alarm, 'macarons')
          alarmPieChart.setOption(_this.pieDateGenerator(response.legend, response.data))
        }
      })
    },
    initBarChart: function() {
      const _this = this
      let barOption = {}
      fetchDataList('date').then(function(response) {
        if (response.success) {
          barOption = _this.barDataGenerator(response.date, response.dataCount)
          const dataBarChart = echarts.init(_this.$refs.gateway, 'macarons')
          dataBarChart.setOption(barOption)
        }
      })
    },
    barDataGenerator: function(date, dateCount) {
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: 90,
          bottom: 40
        },
        xAxis: [
          {
            type: 'category',
            data: date,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#3c3c3c',
                type: 'solid'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#3c3c3c',
                type: 'dotted'
              }
            },
            lineStyle: {
              color: '#3c3c3c',
              type: 'dotted'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: false,
              lineStyle: {
                color: '#3c3c3c',
                type: 'solid'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#3c3c3c',
                type: 'dotted'
              }
            },
            splitArea: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '数据量',
            type: 'line',
            barWidth: '55%',
            itemStyle: {
              normal: {
                color: '#3E87AB'
              }
            },
            data: dateCount,
            markPoint: {
              data: [
                { type: 'max', name: '最大值', itemStyle: {
                  normal: {
                    color: '#C4A964'
                  }
                }},
                { type: 'min', name: '最小值', itemStyle: {
                  normal: {
                    color: '#C47864'
                  }
                }}
              ]
            }
          }
        ]
      }
      return option
    },
    pieDateGenerator: function(legend, data) {
      const color = ['#966bf6', '#7c6df9', '#fd941d', '#58a6ec', '#85a343', '#57e7ec', '#cf9ef1','#8d7fec', '#5085f2', '#e75fc3', '#f87be2']
      const scaleData = []
      const placeHolderStyle = {
        normal: {
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          color: 'rgba(0, 0, 0, 0)',
          borderColor: 'rgba(0, 0, 0, 0)',
          borderWidth: 0
        }
      }
      for (let i = 0; i < data.length; i++) {
        scaleData.push({
          data: data[i].value,
          value: data[i].value,
          name: data[i].name,
          itemStyle: {
            normal: {
              borderWidth: 0,
              shadowBlur: 10,
              color: color[i]
            }
          }
        }, {
          value: 0.05,
          name: '',
          itemStyle: placeHolderStyle
        })
      }
      const pieOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}'
          // formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 5,
          top: 'center',
          bottom: 20,
          itemWidth: 16,
          textStyle: {
            color: '#7073AB',
            fontSize: 12,
            fontWeight: 0
          },
          data: legend
        },
        series: [
          {
            name: '',
            type: 'pie',
            clockWise: false,
            hoverAnimation: false,
            radius: [82, 100],
            center: ['42%', '50%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: 'outside',
                textStyle: {
                  fontSize: '12',
                  fontWeight: 'bold'
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '13',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: scaleData
          }
        ]
      }
      return pieOption
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  font-size: 14px;
  color: #fff;
  .hex {
    color: #fff;
  }
}
.chartArea{
  &>div{
      height: 360px;
  }
  &>div.pie{
    height:240px;
  }
}
.content ul{
  list-style: none;
  color: #95bed6;
}

.content ul li{
  padding:4px 8px 4px;
}

.content ul li:first-child{
  margin-top: 2px;
  height:24px;
  line-height: 24px;
}

.change{
  height: 180px;
}
</style>
