<template>
  <div>
    <div class="dataDisplay-container">
      <div>
        <el-row>
          <div v-for="i in list" :key="i.id" v-bind="i">
            <el-col :span="6" class="tableStyle">
              <el-card class="boxCard" shadow="never" @click.native="dispa(i)">
                <!-- deviceName:设备名  deviceModel：设备属性  modelUnit：单位  degrees：数值 -->
                <div>
                  <el-row>
                    <el-col :span="24" align="center" style="font-size:22px">{{ i.edgeDeviceName }}</el-col>
                  </el-row>
                  <el-row style=" margin-top:10px">
                    <el-col :span="12" align="center">
                      <el-row>{{ i.deviceName }}</el-row>
                      <el-row>{{ i.deviceModel }}</el-row>
                    </el-col>
                    <el-col :span="12" align="center" style=" line-height: 32px;color:yellow;font-size: 24px;">{{ i.degrees }}&nbsp;{{ i.modelUnit }}</el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>
          </div>
        </el-row>
      </div>
      <div class="chart" style="margin-top:30px">
        <div class="top">
          <el-form
            ref="filterForm"
            :inline="true"
            :model="dimension"
            label-width="0px"
            class="filterForm"
            @submit.native.prevent
          >
            <el-form-item>
              <el-date-picker
                v-model.trim="dimension.datetime"
                :editable="false"
                :clearable="false"
                type="datetimerange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-form>
        </div>
        <div id="lineChart" class="body" style="width: 100%;height:400px;margin-top:30px" />
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import echarts from 'echarts'
import {
  getList, getLineDayData
} from '@/api/dataDisplay'
import { mapGetters } from 'vuex'

export default {
  name: 'DataDisplay',
  data() {
    return {
      submiting: false,
      total: 0,
      listLoading: false,
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'ASC',
        relationId: ''
      },
      xData: [],
      yData: [],
      listLine: {
        dataTableName: '',
        deviceName: '',
        createTime: '',
        deviceModel: '',
        startTime: '',
        endTime: ''
      },
      gateway: '215',
      list: [],
      dimension: {
        datetime: ''
      },
      modelUnit: ''// 单位

    }
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  watch: {
    'dimension.datetime'(val) {
      if (val) {
        this.listLine.startTime = val[0]
        this.listLine.endTime = val[1]
      } else {
        this.listLine.startTime = ''
        this.listLine.endTime = ''
      }
      this.getLineDayData()
    }
  },
  created() {
    this.listQuery.relationId = this.$route.query.displayBoardId
    this.getCurrentTime()
    this.getList()
  },
  mounted: function() {
  },
  methods: {
    getList(){
      this.listLoading = true
      getList(this.listQuery).then((response) => {
        if (response.success) {
          this.list = response.data
          if (this.list.length > 0) {
            var list1 = response.data[0]
            this.listLine.dataTableName = list1.dataTableName
            this.listLine.deviceName = list1.deviceName
            this.listLine.createTime = list1.createTime
            this.listLine.deviceModel = list1.deviceModel
            this.modelUnit = list1.modelUnit
            if (list1.createTime === null || list1.degrees === null) {
              this.yData = []
              this.xData = []
              this.lchart()
            } else {
              this.getLineDayData()
            }
          }
        }
        this.listLoading = false
      })
    },
    getLineDayData() {
      getLineDayData(this.listLine).then((response) => {
        if (response.success) {
          this.yData = response.listValue
          this.xData = response.listTime
          this.lchart()
        }
      })
    },
    getCurrentTime() {
      var d = new Date()
      // var preDate = new Date(d.getTime() - 24 * 60 * 60 * 1000); //前一天
      const endYear = d.getFullYear() // 年
      const endMonth = d.getMonth() + 1 // 月
      const endDay = d.getDate() // 日
      this.listLine.endTime =
        endYear + '-' + endMonth + '-' + endDay + ' ' + '23:59:59'
      this.listLine.startTime =
        endYear + '-' + endMonth + '-' + endDay + ' ' + '00:00:00'
      this.dimension.datetime = [this.listLine.startTime, this.listLine.endTime]
    },
    dispa(e) {
      const _this = this
      _this.getCurrentTime()
      _this.listLine.dataTableName = e.dataTableName
      _this.listLine.deviceName = e.deviceName
      _this.listLine.createTime = e.createTime
      _this.listLine.deviceModel = e.deviceModel
      _this.modelUnit = e.modelUnit
      // console.log(e)
      this.getLineDayData()
    },
    lchart: function() {
      var myChart = echarts.init(document.getElementById('lineChart'))
      const _this = this
      myChart.setOption({
        title: {
          text: _this.listLine.deviceName,
          textAlign: 'center',
          textVerticalAlign: 'auto',
          left: 'center',
          subtext: _this.listLine.deviceModel,
          textStyle: {
            color: 'white'
          },
          subtextStyle: {
            align: 'center',
            verticalAlign: 'middle'
          }
        },
        tooltip: {
          trigger: 'axis', // 坐标轴触发
          formatter: '设备属性：' + _this.listLine.deviceModel + '<br/>时间：{b}<br/>数据:{c}' + _this.modelUnit,
          axisPointer: {
            type: 'none'
          }
        },
        xAxis: {
          type: 'category',
          data: _this.xData,
          nameTextStyle: {
            color: 'white'
          },
          axisLine: {
            lineStyle: {
              color: 'white'
            }
          }
        },
        yAxis: {
          axisLabel: {
            formatter: '{value}' + _this.modelUnit
          },
          nameTextStyle: {
            color: 'white'
          },
          axisLine: {
            lineStyle: {
              color: 'white'
            }
          }
        },
        series: [{
          name: _this.listLine.deviceModel,
          type: 'line',
          data: _this.yData,
          itemStyle: {
            normal: {
              color: 'red',
              lineStyle: {
                color: '#00FF00'
              }
            }
          }
        }]
      })
    }

  }
}
</script>
<style scoped lang="scss">
.dataDisplay-container{
  background-color: rgba(7, 21, 43, 0.58);
  padding: 10px;
}
.tableStyle{
  // margin-left: 2%;
  .boxCard {
    cursor: pointer;
    background-color: #5d6ccc;
    border-color: transparent;
    // height:140px;
    width:280px;
    margin-top:5px;
  // .el-card__header {
  //   height: 55px;
  //   line-height: 55px;
  // }
   .clearfix {
      color: #333333;
      font-size: 18px;
      font-weight: bold;
    }
  .el-card__body {
    * {
      font-size: 14px;
      color: white;
    }
    .el-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 20px 0;
    }
  }
}

}

</style>
