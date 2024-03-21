<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>基本属性</span>
          </div>
          <div style="font-size: 14px;height:472px;">
            <el-row>
              <el-col :span="16">处理器核数</el-col>
              <el-col :span="8" align="right">{{ table.cpuCoreSize }}</el-col>
            </el-row>
            <el-divider />
            <el-row>
              <el-col :span="16">MAC地址</el-col>
              <el-col :span="8" align="right">{{ table.macAddr }}</el-col>
            </el-row>
            <el-divider />
            <el-row>
              <el-col :span="16">版本信息</el-col>
              <el-col :span="8" align="right">{{ table.versionName }}</el-col>
            </el-row>
            <el-divider />
            <el-row>
              <el-col :span="16">IP地址</el-col>
              <el-col :span="8" align="right">{{ table.ipAddr }}</el-col>
            </el-row>
            <el-divider />
            <el-row>
              <el-col :span="16">信号强度</el-col>
              <el-col :span="8" align="right">  {{ getRssi(table.rssi).text }} <svg-icon :icon-class="getRssi(table.rssi).signal" /></el-col>
            </el-row>
            <el-divider />
            <el-row>
              <el-col :span="16">总内存大小</el-col>
              <el-col :span="8" align="right">{{ table.totalMemorySize }}</el-col>
            </el-row>
            <el-divider />
            <el-row>
              <el-col :span="16">空闲内存大小</el-col>
              <el-col :span="8" align="right">{{ table.freeMemorySize }}</el-col>
            </el-row>
            <el-divider />
            <el-row>
              <el-col :span="16">总硬盘大小</el-col>
              <el-col :span="8" align="right">{{ table.totalDistSize }}</el-col>
            </el-row>
            <el-divider />
            <el-row>
              <el-col :span="16">空闲硬盘大小</el-col>
              <el-col :span="8" align="right">{{ table.freeDistSize }}</el-col>
            </el-row>
            <el-divider />
          </div>
          <!-- <el-table :show-header="false" :data="tableData" size="mini" style="font-size: 14px;height:434px">
            <el-table-column prop="reportName" width="110" />
            <el-table-column prop="reportValue" align="right" />
          </el-table>
        </el-card> -->
        </el-card></el-col>
      <el-col :span="14">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>网关资源监控</span>
          </div>
          <el-row :gutter="10" class="charts">
            <el-col :span="12">
              <div id="CPU" />
            </el-col>
            <el-col :span="12">
              <div id="MEM" />
            </el-col>
          </el-row>
          <el-row :gutter="10" class="charts">
            <el-col :span="12">
              <div id="DISK" />
            </el-col>
            <el-col :span="12">
              <div id="TEMP" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fetchList, getHistory } from '@/api/outline'
const echarts = require('echarts')
const _ = require('lodash')
var colorSet = {
  color: '#888b89'
}
export default {
  name: 'Outline',
  data() {
    return {
      table: {},
      tableData: [],
      fieldQueryForm: {
        edgeDeviceId: this.$route.query.edgeDeviceId,
        pageSize: 10,
        currentPage: 1,
        orderby: 'createTime',
        order: 'desc'
      }
    }
  },
  mounted: function() {
    const deviceId = this.$route.query.edgeDeviceId
    this.initChart('CPU', 'CPU使用率', 0)
    this.initChart('MEM', '内存使用率', 0, '#FF6600', '#F5F5DC')
    this.initChart('DISK', '硬盘使用率', 0, '#FF6600', '#F5F5DC')
    this.initChart('TEMP', '网关设备温度', 0, '#009999', 'lightgreen')
    fetchList(deviceId).then(response => {
      if (response.success) {
        this.table = response.data
        this.initChart('CPU', 'CPU使用率', this.table.cpuUseRate)
        this.initChart(
          'MEM',
          '内存使用率',
          this.table.memoryUseRate,
          '#FF6600',
          '#F5F5DC'
        )
        this.initChart(
          'TEMP',
          '网关设备温度',
          this.table.deviceTemp,
          '#009999',
          'lightgreen'
        )
        this.initChart(
          'DISK',
          '硬盘使用率',
          this.table.distUseRate,
          '#6161b6',
          '#b063bb85'
        )
      }
    }),
    getHistory(this.fieldQueryForm).then((response) => {
      if (response.success) {
        this.tableData = response.data
        if (this.tableData.length > 0) {
          this.table.versionName = this.tableData[0].versionName
        }
      } else {
        this.tableData = []
      }
    })
  },
  methods: {

    initChart: function(id, name, value, color, lightColor) {
      const container = document.getElementById(id)
      const myChart = echarts.init(container)
      const option = this.setOption(name, value, color, lightColor)
      myChart.setOption(option)
    },
    setOption: function(name, value, color, lightColor) {
      const $name = name
      const $value = value || 0
      const $color = color || '#CC0033'
      const $lightColor = lightColor || 'pink'
      return {
        tooltip: {
          formatter: function() {
            if (name === '网关设备温度') {
              return name + ':' + parseInt(value) + '℃'
            } else {
              return name + ':' + value + '%'
            }
          }
        },
        series: [
          {
            name: $name,
            type: 'gauge',
            // center: ['50%', '50%'],
            title: {
              show: true,
              color: '#888b89',
              offsetCenter: ['0', '120%'],
              fontSize: 10
            },
            radius: '40%',
            splitNumber: 80,
            detail: {
              fontSize: 15,
              formatter: function() {
                if (name === '网关设备温度') {
                  return parseInt(value) + '℃'
                } else {
                  return value + '%'
                }
              },
              color: $color,
              offsetCenter: [0, 35]
            },
            data: [{ value: $value, name: $name }],
            axisLine: {
              show: false,
              lineStyle: {
                width: 25,
                color: [
                  [$value / 100, $color],
                  [1, $lightColor]
                ]
              }
            },

            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            itemStyle: {
              show: false
            },
            pointer: {
              show: true,
              length: '90%',
              radius: '8%',
              width: 8
            }
          },
          {
            name: '外部刻度',
            type: 'gauge',
            //  center: ['20%', '50%'],
            radius: '80%',
            min: 0,
            max: 100,
            splitNumber: 10,
            startAngle: 225,
            endAngle: -45,
            axisLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: [
                  [$value / 100, $color],
                  [1, $lightColor]
                ]
              }
            },
            axisLabel: {
              show: true,
              color: [[$color], [$lightColor]],
              distance: 25,
              textStyle: {
                color: '#000',
                fontSize: 7,
                shadowColor: '#000'
              }
            },
            axisTick: {
              show: true,
              splitNumber: 7,
              lineStyle: {
                color: colorSet.color,
                width: 1
              },
              length: -8
            },
            splitLine: {
              show: false,
              length: -20,
              lineStyle: {
                color: [
                  [$value / 100, $color],
                  [1, $lightColor]
                ]
              }
            },
            detail: {
              show: false
            },
            pointer: {
              show: false
            }
          }
        ]
      }
    },
    getRssi(rssi) {
      let msg = {
        text: '',
        signal: ''
      }
      if (rssi != null) {
        if (rssi < -125) {
          msg.text = '差'
          msg.signal = 'Signal-3-1'
        } else if (rssi < -95) {
          msg.text = '中'
          msg.signal = 'signal-3-2'
        } else if (rssi >= -95) {
          msg.text = '强'
          msg.signal = 'signal-3-3'
        }
      }
      return msg
    }
  }

}
</script>

<style scoped lang="scss">
.box-card {
  .el-card__header {
    height: 55px;
    line-height: 55px;
    & > div {
      border-left: 5px solid green;
      padding-left: 10px;
    }
    span {
      color: #333333;
      font-size: 14px;
      font-weight: 500;
    }
  }
  .el-card__body {
    * {
      font-size: 14px;
    }
    .el-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 20px 0;
    }
    .charts {
      .el-col {
        & > div {
          width: 100%;
          height: 226.5px;
        }
      }
    }
  }
}
</style>
