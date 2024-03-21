<template>
  <el-row :gutter="10" class="summary" style="padding: 10px 15px;background-color: #ececec">
    <el-row :gutter="20" style="padding: 10px;">
      <el-col :span="12" style="padding: 10px;background-color: #fff;height: 380px;">
        <div class="chart">
          <div class="header">
            <i class="el-icon-s-platform" style="color: #00C3C4;font-size: 14px;font-size: 14px;" />
            <span>网关告警</span>
          </div>
          <div class="chartArea">
            <div ref="geteway" class="bar" style="margin-top:-20px;" />
          </div>
        </div>
      </el-col>

      <el-col :span="12" style="background-color: #fff;border-left:15px solid #ececec;padding: 10px;height: 380px;">
        <div class="chart">
          <div class="minus">
            <div class="header">
              <i class="el-icon-s-platform" style="color: #00C3C4;font-size: 14px;font-size: 14px;" />
              <span>CPU使用率</span>
            </div>
            <div class="chartArea">
              <div ref="getCpu" class="bar" style="margin-top:-20px;" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="padding: 10px;">
      <el-col :span="12" style="padding: 10px;background-color: #fff;height: 380px;">
        <div class="chart">
          <div class="header">
            <i class="el-icon-s-platform" style="color: #00C3C4;font-size: 14px;font-size: 14px;" />
            <span>内存使用率</span>
          </div>
          <div class="chartArea">
            <div ref="getNeic" class="bar" style="margin-top:-20px;" />
          </div>
        </div>
      </el-col>

      <el-col :span="12" style="background-color: #fff;border-left:15px solid #ececec;padding: 10px;height: 380px;">
        <div class="chart">
          <div class="minus">
            <div class="header">
              <i class="el-icon-s-platform" style="color: #00C3C4;font-size: 14px;font-size: 14px;" />
              <span>网关接入设备数</span>
            </div>
            <div class="chartArea">
              <div ref="getSheb" class="bar" style="margin-top:-20px;" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import {
  fetchNeicList,
  fetchCpuList,
  fetchShebList,
  fetchDataList
} from '@/api/top'
const echarts = require('echarts')
export default {
  data: function() {
    return {}
  },
  mounted: function() {
    this.initPieChart()
  },
  methods: {
    initPieChart: function() {
      const _this = this
      fetchDataList().then(function(response) {
        if (response.success) {
          const name = '网关告警数'
          const dataBarChart = echarts.init(_this.$refs.geteway, 'macarons')
          dataBarChart.setOption(
            _this.barDataGenerator(response.data, response.dataCount, name)
          )
        }
      })
      fetchCpuList().then(function(response) {
        if (response.success) {
          const name = 'CPU使用率'
          const cpuPieChart = echarts.init(_this.$refs.getCpu, 'macarons')
          cpuPieChart.setOption(
            _this.barDataGenerator(response.data, response.dataCount, name)
          )
        }
      })
      fetchNeicList().then(function(response) {
        if (response.success) {
          const name = '内存使用率'
          const neicPieChart = echarts.init(_this.$refs.getNeic, 'macarons')
          neicPieChart.setOption(
            _this.barDataGenerator(response.data, response.dataCount, name)
          )
        }
      })
      fetchShebList().then(function(response) {
        if (response.success) {
          const name = '网关接入设备数'
          const shebPieChart = echarts.init(_this.$refs.getSheb, 'macarons')
          shebPieChart.setOption(
            _this.barDataGenerator(response.data, response.dataCount, name)
          )
        }
      })
    },
    barDataGenerator: function(data, dateCount, name) {
      const option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: data,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: name,
            type: 'bar',
            barWidth: '5%',
            data: dateCount
          }
        ]
      }

      return option
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  font-size: 14px;
}
.chartArea {
  & > div {
    height: 360px;
  }
  & > div.pie {
    height: 240px;
  }
}
</style>
