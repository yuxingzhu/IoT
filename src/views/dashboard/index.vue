<template>
  <div class="home">
    <!--1.  顶部区域布局---------- -->
    <div class="header">
      <div class="item">
        <div class="sumtotal">网关总数</div>
        <div class="sumtotal-num">{{workshop.gatewayTotalCount|| number }}</div>
        <div class="onlinegateway">
          <span class="gray">在线网关数</span>
          <span>{{workshop.gatewayOnlineCount || number }}</span>
        </div>
        <div class="offline-onlinegateway">
          <span class="gray">离线网关数</span>
          <span>{{workshop.gatewayOfflineCount|| number }}</span>
        </div>
        <div id="percentage" class="percentage" style="width: 100px; height: 100px"/>
      </div>
      <div class="item">
        <div class="sumtotal">设备总数</div>
        <div class="sumtotal-num">{{gateway.totalCount|| number }}</div>
        <div class="onlinegateway">
          <span class="gray">在线设备数</span>
          <span>{{gateway.onlineCount|| number }}</span>
        </div>
        <div class="offline-onlinegateway">
          <span class="gray">离线设备数</span>
          <span>{{gateway.offlineCount|| number }}</span>
        </div>
        <div
          id="Totaldevice"
          class="percentage"
          style="width: 100px; height: 100px"
        />
      </div>
      <div class="item">
        <div class="sumtotal">租户总数</div>
        <div class="sumtotal-num">{{  number }}</div>
        <div class="gray-eight">截止昨日24点</div>
      </div>
      <div class="item">
        <div class="sumtotal">项目总数</div>
        <div class="sumtotal-num">{{totalRowCount||number}}</div>
        <div class="gray-eight">截止昨日24点</div>
      </div>
      <div class="item">
        <div class="sumtotal">产品总数</div>
        <div class="sumtotal-num">{{ number }}</div>
        <div class="gray-eight">截止昨日24点</div>
      </div>
      <div class="item">
        <div class="sumtotal">昨日API调用数</div>
        <div class="sumtotal-num">{{ number }}</div>
        <div class="gray-eight">截止昨日24点</div>
      </div>
    </div>

    <!--2. 访问数据统计 ----------------->
    <div class="content">
      <div class="content-top">
        <div class="area">
          <div id="breakalarm" style="width: 100%; height: 240px" />
        </div>
        <div class="area">
          <div id="main" style="width: 100%; height: 240px" />
        </div>
        <div class="area">
          <div id="piechart" style="width: 100%; height: 240px" />
        </div>
        <div class="area">
          <div id="numbertimes" style="width: 100%; height: 240px" />
        </div>
      </div>
      <div class="content-top">
        <div class="area">
          <div id="totalduration" style="width: 100%; height: 240px" />
        </div>

        <div class="area">
          <div id="flowalarm" style="width: 100%; height: 240px" />
        </div>
        <div class="area">
          <div id="acceptance" style="width: 100%; height: 240px" />
        </div>
        <div class="area">
          <div id="instantalarm" style="width: 100%; height: 240px" />
        </div>
      </div>
    </div>
  </div>
</template>
<script> 
import * as echarts from 'echarts'
import Datearr from '../../components/demo.js'
import {
  countOn,
  // 设备总览
  gatewaysource,
  // 网关总览
  getPerformance,
  getLastPerformance
  // 网关告警
} from "@/api/largescreen";
import {
  getList
} from '@/api/projectManage'
export default {
  data() {
    return {
      workshop:[],
      gateway:"",
      getNowTime: '',
      nowTime: '',
      data: '',
      tobparameter: {},
      todata: Datearr,
      number: '0',
      totalRowCount:"",
      listQuery: {
        projectName: '',
        currentPage: 1,
        pageSize: 10,
        orderBy: 'id',
        order: 'desc'
      },
    }
  },
  created(){
    this.initcountOn()
    this.initcountOndata()
    this.getList()
    this.getPerformance()
    this.getLastPerformance()
  },
  methods:{
    getPerformance(){
      getPerformance().then((response) => {
        // console.log(response,"response")
     
           this.workdata = response;
           var keyAry = [];
           var valueAry = [];
          for(var key in this.workdata){
         keyAry.unshift(key);
      //  valueAry.unshift(this.workdata[key]);

        }
        valueAry = [16]
        this.main(keyAry,valueAry)
      })
    },
    getLastPerformance(){
      getLastPerformance().then((response) => {
        this.workdate = response;
           var keyAry = [];
           var valueAry = [];
           for(var key in this.workdate){
           keyAry.unshift(key);
           valueAry.unshift(this.workdate[key]);
           }
          
            const datax = [
            { value:keyAry, name:valueAry }
           ]
            this.Piechart(datax)
        })
    },
    getList() {
      getList(this.listQuery).then((response) => {
        if (response.success) {
          this.totalRowCount= response.totalRowCount

       
        } else {
          this.list = []
        }
      })
    },
    initcountOn() {
      countOn().then((response) => {
        if (response.success) {
          this.gateway = response
          // console.log(this.gateway,"this.totalRowCount")
          const data = [
            {
              value: response.offlineCount,
              itemStyle: { color: '#4169E1' }
            
            },
            {
              value: response.onlineCount,
              itemStyle: { color: '#FF9912' }
            },
          ];
          this.maindata(data);
          
        }
      })
    },
    initcountOndata() {
      gatewaysource().then((response) => {
        if (response.success) {
          this.workshop = response;
          const data = [
            {
              value: response.gatewayOfflineCount,
              itemStyle: { color: '#4169E1' }
            },
            {
              value: response.gatewayOnlineCount,
              itemStyle: { color: '#FF9912' }
            }
          ];
          this.indexed(data);
        }
      })
    },
    indexed(data){
      var Percentage = echarts.init(document.getElementById('percentage'))
    Percentage.setOption({
      title: {
        left: 'center'
       },
      tooltip: {},
      series: [
        {
          label: {
            show: true,
            position: 'inside'
          },
          type: 'pie',
          radius: ['0%', '50%'],
          data,
        }
      ]
    })
    window.addEventListener("resize", () => {
      Percentage.resize();
      });
    },
    maindata(data){
      var Totaldevice = echarts.init(document.getElementById('Totaldevice'))
    Totaldevice.setOption({
      title: {
        left: 'center'
      },
      tooltip: {},
      series: [
        {
          label: {
            show: true,
            position: 'inside'
          },
          type: 'pie',
          radius: ['0%', '50%'],
          data,
        }
      ]
    })
    window.addEventListener("resize", () => {
      Totaldevice.resize();
      });
    },
    main(keyAry,valueAry){
      var myChartdata = echarts.init(document.getElementById('main'))
    myChartdata.setOption({
      title: {
        text: '网关性能告警次数(7日)',
        textStyle: {
          fontWeight: 'bolder',
          fontSize: 13
        }
      },
      tooltip: {},
      legend: {},
      xAxis: {
        data: this.todata,
        axisLabel: {
          interval: this.todata.length - 2,
          textStyle: {
            fontSize: '12'
          }
        }
      },
      yAxis: {
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      grid: {
        top: '70',
        right: '8%',
        bottom: '16%',
        left: '8%'
      },

      series: [
        {
          type: 'bar',
          data:valueAry,
          barWidth: 15,
          itemStyle: {
				    normal: {
				        color: '#4169E1'
				    }
				  }
        }
      ]
    })
    window.addEventListener("resize", () => {
      myChartdata.resize();
      });
    },
    Piechart(datax){
      let dataw=[]
      let dataColor=[{ value: 1048, name: '',itemStyle:{color:"#90EE90"} }]
      if(!datax){
        this.dataw=datax
      }else{
        this.dataw=dataColor
      }
      var Piechart = echarts.init(document.getElementById('piechart'))
      Piechart.setOption({

      title: {
        text: '昨日网关性能告警饼图',
        textStyle: {
          fontWeight: 'bolder',
          fontSize: 13
        }
      },
      tooltip: {
        trigger: 'item'
      },

      legend: {
        orient: 'horizontal',
        top: '10%',
        left: 'center',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 10,
        icon: 'circle',
        textStyle: {
          borderRadius: 10
        }
      },

      series: [
        {
          top: 20,
          type: 'pie',
          radius: ['25%', '70%'],
          avoidLabelOverlap: false,
          silent:'ture',
          label: {
            show: true,
            position: 'inside',
            // formatter: `{d}%`,
            color: '#FFFFFF',
            tyle: {
              fontWeight: 200,
              fontSize: 20
            }
          },
          emphasis: {
             itemStyle: {
               shadowBlur: 10,
               shadowOffsetX: 0,
               shadowColor: "rgba(0, 0, 0, 0.5)",
             },
           },
          data: this.dataw,
        }
      ]
    })
    window.addEventListener("resize", () => {
      Piechart.resize();
      });
    }
},
  mounted() {
    const data = [21, 45, 45, 21, 41, 21, 41, 11]
    const alarmlevel = [
      [36, 158, 258, 265, 275, 276, 300],
      [35, 121, 213, 241, 264, 274, 296],
      [47, 138, 290, 275, 241, 276, 274],
      [100, 120, 230, 240, 250, 260, 288],
      [120, 150, 210, 220, 240, 250, 260]
    ]
    const alarmeven = [
      [23, 45, 67, 89, 120, 156, 170],
      [89, 121, 124, 123, 143, 144, 189],
      [47, 43, 65, 123, 156, 176, 174],
      [99, 123, 130, 140, 150, 160, 188],
      [34,112, 110, 120, 130, 135, 160]
    ]
    const rateofflow = [
      [124, 211, 213, 453, 556, 757, 665],
      [124, 231, 213, 535, 656, 657, 665]
    ]

    const BreakAlarm = echarts.init(document.getElementById('breakalarm'))
    BreakAlarm.setOption({
      title: {
        text: '网关断网总时长(7日)单位：分钟',
        textStyle: {
          fontWeight: 'bolder',
          fontSize: 13,
          color: '#242424'
        }
      },
      xAxis: {
        type: 'category',
        data: this.todata,
        boundaryGap: false,
        axisLabel: {
          interval: this.todata.length - 2,
          textStyle: {
            fontSize: '12'
          }
        },
        splitLine: {
          lineStyle: {
            type: 'solid'
          }
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        top: '70', // 图表距组件上边距离
        right: '11%', // 图表距组件右边距离
        bottom: '16%', // 图表距组件下边距离
        left: '11%'
      },
      yAxis: {
        type: 'value',
        data,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [
        {
          data,
          type: 'line',
          symbol: 'none',
          areaStyle: {
            color: echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0.4,
                color: '#B0E0E6'
              },
              {
                offset: 1,
                color: '#4169E1'
              }
            ])
          },
          itemStyle: {
				    normal: {
				        color: '#4169E1'
				    }
				  }

        }
      ]
    })
    var Numbertimes = echarts.init(document.getElementById('numbertimes'))
    Numbertimes.setOption({
      title: {
        text: '网关告警次数(7日)',
        textStyle: {
          fontWeight: 'bolder',
          fontSize: 13
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        top: 20,
        orient: 'horizontal',
        x: 'center',
        y: 'top',
        // data:['发送流量','接受流量'],
        color: '#ffffff',
        itemHeight: 2,
        itemWidth: 20,
        itemStyle: { opacity: 2 }
      },
      grid: {
        top: '70',
        left: '0%',
        right: '10%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.todata,
        axisLabel: {
          interval: this.todata.length - 2,
          textStyle: {
            fontSize: 12
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'solid'
          }
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: '未分类',
          type: 'line',
          data: alarmlevel[0],
          symbol: 'none'
        },
        {
          name: '资讯',
          type: 'line',
          data: alarmlevel[1],
          symbol: 'none'
        },
        {
          name: '警告',
          type: 'line',
          data: alarmlevel[2],
          symbol: 'none'
        },
        {
          name: '一般严重',
          type: 'line',
          data: alarmlevel[3],
          symbol: 'none'
        },
        {
          name: '严重',
          type: 'line',
          data: alarmlevel[4],
          symbol: 'none'
        },
        {
          name: '灾难',
          type: 'line',
          data: alarmlevel[5],
          symbol: 'none'
        }
      ]
    })
    var Totalduration = echarts.init(document.getElementById('totalduration'))
    Totalduration.setOption({
      title: {
        text: '网关断网总时长(7日)单位：分钟',
        textStyle: {
          fontWeight: 'bolder',
          fontSize: 13
        }
      },

      xAxis: {
        type: 'category',
        data: this.todata,
        boundaryGap: false,
        axisLabel: {
          interval: this.todata.length - 2,
          textStyle: {
            fontSize: '12'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'solid'
          }
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        top: '70',
        right: '8%',
        bottom: '16%',
        left: '8%'
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [
        {
          data,
          type: 'line',
          symbol: 'none',
          areaStyle: {
            color: echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0.4,
                color: '#B0E0E6'
              },
              {
                offset: 1,
                color: '#4169E1'
              }
            ])
          },
          itemStyle: {
				    normal: {
				        color: '#4169E1'
				    }
				  }
        }
      ]
    })
    var Flowalarm = echarts.init(document.getElementById('flowalarm'))
    Flowalarm.setOption({
      title: {
        text: '流量超限告警次数(7日)',
        textStyle: {
          fontWeight: 'bolder',
          fontSize: 13
        }
      },
      tooltip: {},
      legend: {},
      xAxis: {
        data: this.todata,
        axisLabel: {
          interval: this.todata.length - 2,
          textStyle: {
            fontSize: '12'
          }
        }
      },
      yAxis: {
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      grid: {
        top: '70',
        right: '8%',
        bottom: '16%',
        left: '8%'
      },
      series: [
        {
          type: 'bar',
          data,
          barWidth: 15,
          itemStyle: {
				    normal: {
				        color: '#4169E1'
				    }
				  }
        }
      ]
    })
    var Acceptance = echarts.init(document.getElementById('acceptance'))
    Acceptance.setOption({
      title: {
        text: '接收/发送流量数(7日)',
        textStyle: {
          fontWeight: 'bolder',
          fontSize: 13
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        top: 20,
        orient: 'horizontal',
        x: 'center',
        y: 'top',
        data: ['发送流量', '接受流量'],
        color: '#ffffff',
        itemHeight: 2,
        itemWidth: 20,
        itemStyle: { opacity:1 }
      },
      xAxis: {
        // type: 'category',
        boundaryGap: false,
        data: this.todata,
        axisLabel: {
          interval: this.todata.length - 2,
          textStyle: {
            fontSize: '12'
          }
        },
        axisTick: {
          show: true
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'solid'
          }
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      grid: {
        top: '70',
        right: '10%',
        bottom: '16%',
        left: '10%'
      },
      series: [
        {
          type: 'line',
          data: rateofflow[0],
          name: '发送流量',
          symbol: 'none',
          lineStyle: {
            color: "rgba(58,77,233,0.3)",
          },  
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(58,77,233,0.8)'
              },
              {
                offset: 1,
                color: 'rgba(58,77,233,0.3)'
              }
            ])
          }
        },
        {
          // name: 'Search Engine',
          type: 'line',
          data: rateofflow[1],
          name: '接受流量',
          symbol: 'none',
          lineStyle: {
            color: "rgba(0,128,0,0.3)",
          },  
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(0,128,0,0.8)'
              },
              {
                offset: 1,
                color: 'rgba(0,128,0,0.3)'
              }
            ])
          }
        }
      ]
    })
    var Instantalarm = echarts.init(document.getElementById('instantalarm'))
    Instantalarm.setOption({
      title: {
        text: '设备离线告警次数(7日)',
        textStyle: {
          fontWeight: 'bolder',
          fontSize: 13
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        top: 20,
        orient: 'horizontal',
        x: 'center',
        y: 'top',
        color: '#ffffff',
        itemHeight: 1,
        itemWidth: 20,
        itemStyle: { opacity: 3 },
      //   // name:["未分类"]
      },
      grid: {
        top: '70',
        left: '0%',
        right: '10%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.todata,
        axisLabel: {
          interval: this.todata.length - 2,
          textStyle: {
            fontSize: '12'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'solid'
          }
        }
      },
      yAxis: {
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: '未分类',
          type: 'line',
          data: alarmeven[0],
          symbol: 'none'
        },
        {
          name: '资讯',
          type: 'line',
          data: alarmeven[1],
          symbol: 'none'
        },
        {
          name: '警告',
          type: 'line',
          data: alarmeven[2],
          symbol: 'none'
        },
        {
          name: '一般严重',
          type: 'line',
          data: alarmeven[3],
          symbol: 'none'
        },
        {
          name: '严重',
          type: 'line',
          data: alarmeven[4],
          symbol: 'none'
        },
        {
          name: '灾难',
          type: 'line',
          data: alarmlevel[5],
          symbol: 'none'
        }
      ]
    })

    window.addEventListener('resize', () => {
      if (BreakAlarm) {
        BreakAlarm.resize()
      }
      if (Numbertimes) {
        Numbertimes.resize()
      }
      if (Totalduration) {
        Totalduration.resize()
      }
      if (Flowalarm) {
        Flowalarm.resize()
      }
      if (Acceptance) {
        Acceptance.resize()
      }
      if (Instantalarm) {
        Instantalarm.resize()
      }
    })
  }
}
</script> 

<style lang="scss" scoped>
.home{
  margin-top: 20px;
  background: #F0F2F5;
}
.header {
  display: flex;
  justify-content: space-between;
  .item {
    flex: 1;
    padding: 20px;
    background: #fff;
    position: relative;
    margin-right: 16px;
    line-height: 30px;
    .sumtotal {
      font-size: 18px;
      color: #777777;
    }
    .sumtotal-num {
      color: #232323;
      font-size: 26px;
      margin-top: 5px;
      margin-bottom: 5px;
      font-weight: 700;
    }
    .onlinegateway {
      display: flex;
      justify-content: space-between;
    
      .gray {
        font-size: 16px;
        color: #777777;
      }
      span:nth-child(2) {
        font-size: 20px;
        font-weight: 700;
      }
    }
    .offline-onlinegateway {
      display: flex;
      justify-content: space-between;
      .gray {
        font-size: 16px;
        color: #777777;
      }
      span:nth-child(2) {
        font-size: 20px;
        font-weight: 700;
      }
    }
    .percentage {
      position: absolute;
      right: 0px;
      top: 0px;
    }
  }
}
.gray-eight {
  color: rgba(128, 128, 128, 0.877);
  margin-top: 40px;
  margin-left: 10px;
}
// 图表
.content {
  .content-top {
    display: flex;
    justify-content: space-between;
    // overflow: auto
    // width: 100%;
    // height: 100%;
  }
  .area {
    padding: 10px 0 10px 10px;
    background: #fff;
    flex: 1;
    margin-right: 18px;
    margin-top: 18px;
    // flex-shrink: 0
  }

}
</style>

