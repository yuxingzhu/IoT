import echarts from 'echarts'

function initXDataArr(size) {
  const xData = []
  for (var i = 1; i <= size; i++) {
    if (i < 10) {
      xData[i - 1] = '0' + i + ''
    } else {
      xData[i - 1] = i + ''
    }
  }
  return xData
}

function initYDataArr(size, val, discrete) {
  const yData = []
  for (var i = 0; i <= size; i++) {
    yData[i] = Math.round(val - discrete * Math.random())
  }
  return yData
}

function setBar(xData, yData, unit) {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      show: false,
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      top: '18%',
      right: '3%',
      left: '7%',
      bottom: '2%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      data: xData,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#2aa2dd'
        }
      },
      axisLabel: {
        margin: 10,
        color: '#2aa2dd',
        textStyle: {
          fontSize: 12
        }
      }
    }],
    yAxis: [{
      name: unit,
      splitNumber: 3,
      axisLabel: {
        formatter: '{value}',
        color: '#2aa2dd'
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#2aa2dd'
        }
      },
      splitLine: {
        show: false
      }
    }],
    series: [{
      type: 'bar',
      data: yData,
      barWidth: '20px',
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(0,244,255,1)' // 0% 处的颜色
          }, {
            offset: 1,
            color: 'rgba(0,77,167,1)' // 100% 处的颜色
          }], false),
          shadowColor: 'rgba(0,160,221,1)',
          shadowBlur: 4
        }
      }
    }]
  }
}

function setPie(seriesData) {
  function array2obj(array, key) {
    var resObj = {}
    for (var i = 0; i < array.length; i++) {
      resObj[array[i][key]] = array[i]
    }
    return resObj
  }
  var legendData = ['动力', '空调', '照明', '特殊']
  var colorList = ['#73DDFF', '#73ACFF', '#FDD56A', '#FDB36A', '#FD866A', '#9E87FF', '#58D5FF']
  const objData = array2obj(seriesData, 'name')
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      borderColor: 'rgba(255,255,255,.3)',
      backgroundColor: 'rgba(13,5,30,.6)',
      borderWidth: 1,
      padding: 5,
      formatter: function(parms) {
        var str = parms.marker + '' + parms.data.name + '</br>' +
          '占比：' + parms.percent + '%'
        return str
      }
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      left: 'right',
      align: 'auto',
      top: 'middle',
      // left: '65%',
      itemGap: 30,
      // textStyle: {
      //   color: '#fff'
      // },
      data: legendData,
      formatter: function(name) {
        return `{name|${name}}   {percent|${objData[name].value}}`
      },
      textStyle: {
        rich: {
          name: {
            color: '#fff',
            padding: [0, 0, 0, 5]
          },
          percent: {
            color: '#82baff',
            fontSize: 16,
            fontWeight: 600,
            fontFamily: 'HuaKang'
          }
        }
      }
    },
    series: [{
      type: 'pie',
      z: 3,
      center: ['40%', '60%'],
      radius: ['55%', '80%'],
      clockwise: true,
      avoidLabelOverlap: true,
      hoverOffset: 15,
      itemStyle: {
        normal: {
          color: function(params) {
            return colorList[params.dataIndex]
          }
        }
      },
      label: {
        show: false
      },
      labelLine: {
        normal: {
          length: 20,
          length2: 30,
          lineStyle: {
            width: 1
          }
        }
      },
      data: seriesData
    }]
  }
}

function setLine(xData, yData, unit) {
  return {
    backgroundColor: 'transparent',
    xAxis: [{
      show: true,
      type: 'category',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#2aa2dd'
        }
      },
      splitArea: {
        show: false
      },
      axisLabel: {
        color: '#2aa2dd'
      },
      splitLine: {
        show: false
      },
      boundaryGap: false,
      data: xData
    }],
    grid: {
      top: '18%',
      right: '3%',
      left: '7%',
      bottom: '2%',
      containLabel: true
    },
    yAxis: [{
      name: unit,
      type: 'value',
      max: 2000,
      min: 0,
      splitNumber: 4,
      splitLine: {
        show: false,
        lineStyle: {
          color: 'rgba(255,255,255,0.1)'
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#2aa2dd'
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#2aa2dd'
        }
      },
      axisTick: {
        show: false
      }
    }],
    series: [{
      type: 'line',
      smooth: true,
      showAllSymbol: false,
      symbol: 'circle',
      symbolSize: 2,
      lineStyle: {
        normal: {
          color: '#99ffdd'
        }
      },
      itemStyle: {
        color: '#00b3f4'
      },
      data: yData
    }

    ]
  }
}

function setGauge() {
  const data = {
    name: '应用',
    value: 66
  }
  const posCenter = ['50%', '80%']
  return {
    backgroundColor: 'transparent',
    series: [{
      // 外围刻度
      type: 'gauge',
      radius: '130%',
      center: posCenter,
      splitNumber: 4,
      min: 0,
      max: 100,
      startAngle: 180,
      endAngle: 0,
      axisLine: {
        show: true,
        lineStyle: {
          width: 2,
          shadowBlur: 0,
          color: [
            [
              1,
              new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: 'rgba(1,50,140)'
              },
              {
                offset: 0.1,
                color: 'rgba(1,192,229,1)'
              },
              {
                offset: 0.9,
                color: 'rgba(1,192,229,1)'
              },
              {
                offset: 1,
                color: 'rgba(1,50,140)'
              }
              ])
            ]
          ]
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      pointer: {
        show: 0
      }
    },
    {
      // 内侧指针、数值显示
      name: '',
      type: 'gauge',
      radius: '100%',
      center: posCenter,
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      axisLine: {
        show: true,
        lineStyle: {
          width: 300,
          color: [
            [
              1,
              new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: 'rgba(1,192,229,0.2)'
              },
              {
                offset: 1,
                color: 'rgba(219,100,159,0.5)'
              }
              ])
            ]
          ]
        }
      },
      axisTick: {
        show: 0
      },
      splitLine: {
        show: 0
      },
      axisLabel: {
        show: 0
      },
      pointer: {
        show: true,
        length: '105%',
        width: 3
      },
      detail: {
        show: false
      },
      itemStyle: {
        normal: {
          color: '#fff'
        }
      },
      data: [{
        value: data.value
      }],
      z: 9
    },
    {
      type: 'gauge',
      radius: '40%',
      center: posCenter,
      splitNumber: 4,
      min: 0,
      max: 100,
      startAngle: 180,
      endAngle: 0,
      axisLine: {
        show: true,
        lineStyle: {
          width: 2,
          shadowBlur: 0,
          color: [
            [
              1,
              new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: 'rgb(1,192,229)'
              },
              {
                offset: 1,
                color: 'rgb(219,100,159)'
              }
              ])
            ]
          ]
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      pointer: {
        show: 0
      },
      detail: {
        show: 0
      }
    },
    {
      type: 'gauge',
      radius: '70%',
      center: posCenter,
      splitNumber: 0, // 刻度数量
      startAngle: 180,
      endAngle: 0,
      axisLine: {
        show: true,
        lineStyle: {
          width: 15,
          color: [
            [
              data.value / 100,
              new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: '#508cff'
              },
              {
                offset: 1,
                color: '#77f0ff'
              }
              ])
            ],
            [1, 'transparent']
          ]
        }
      },
      // 分隔线样式。
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      },
      pointer: {
        show: false
      },
      title: {
        show: false
      },
      // 仪表盘详情，用于显示数据。
      detail: {
        show: false
      },
      data: [{
        value: data.value
      }]
    },
    {
      // 指针外环
      type: 'pie',
      hoverAnimation: false,
      legendHoverLink: false,
      center: posCenter,
      radius: ['4%', '6%'],
      z: 10,
      label: {
        normal: {
          show: false
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: [{
        value: 100,
        itemStyle: {
          normal: {
            color: '#00fffc'
          }
        }
      }]
    },
    {
      // 指针内环
      type: 'pie',
      hoverAnimation: false,
      legendHoverLink: false,
      center: posCenter,
      radius: ['0%', '4%'],
      z: 10,
      label: {
        normal: {
          show: false
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: [{
        value: 100,
        itemStyle: {
          normal: {
            color: '#bbfdff'
          }
        }
      }]
    }
    ]
  }
}

function setHorizonBar() {
  var category = [{
    name: '电表(在线/全部)',
    value: 11
  },
  {
    name: '水表(在线/全部)',
    value: 12
  },
  {
    name: '气表(在线/全部)',
    value: 10
  }
  ] // 类别
  var total = 12 // 数据总数
  var datas = []
  category.forEach(value => {
    datas.push(value.value)
  })
  return {
    backgroundColor: 'transparent',
    xAxis: {
      max: total,
      splitLine: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    grid: {
      left: 125,
      top: 20, // 设置条形图的边距
      right: 60,
      bottom: 20
    },
    yAxis: [{
      type: 'category',
      inverse: false,
      data: category,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      }
    }],
    series: [{
      // 内
      type: 'bar',
      barWidth: 18,

      legendHoverLink: false,
      silent: true,
      itemStyle: {
        normal: {
          color: function(params) {
            var color
            if (params.dataIndex == 19) {
              color = {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                  offset: 0,
                  color: '#EB5118' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#F21F02' // 100% 处的颜色
                }
                ]
              }
            } else if (params.dataIndex == 18) {
              color = {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                  offset: 0,
                  color: '#FFA048' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#B25E14' // 100% 处的颜色
                }
                ]
              }
            } else if (params.dataIndex == 17) {
              color = {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                  offset: 0,
                  color: '#F8E972' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#E5C206' // 100% 处的颜色
                }
                ]
              }
            } else {
              color = {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                  offset: 0,
                  color: '#1588D1' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#0F4071' // 100% 处的颜色
                }
                ]
              }
            }
            return color
          }
        }
      },
      label: {
        normal: {
          show: true,
          position: 'left',
          formatter: '{b}',
          textStyle: {
            color: '#fff',
            fontSize: 14
          }
        }
      },
      data: category,
      z: 1,
      animationEasing: 'elasticOut'
    },
    {
      // 分隔
      type: 'pictorialBar',
      itemStyle: {
        normal: {
          color: '#061348'
        }
      },
      symbolRepeat: 'fixed',
      symbolMargin: 6,
      symbol: 'rect',
      symbolClip: true,
      symbolSize: [1, 21],
      symbolPosition: 'start',
      symbolOffset: [1, -1],
      symbolBoundingData: this.total,
      data: category,
      z: 2,
      animationEasing: 'elasticOut'
    },
    {
      // 外边框
      type: 'pictorialBar',
      symbol: 'rect',
      symbolBoundingData: total,
      itemStyle: {
        normal: {
          color: 'none'
        }
      },
      label: {
        normal: {
          formatter: (params) => {
            var text
            if (params.dataIndex == 1) {
              text = '{a|  100%}{f|  ' + params.data + '/' + total + '}'
            } else if (params.dataIndex == 2) {
              text = '{b|  100%}{f|  ' + params.data + '/' + total + '}'
            } else if (params.dataIndex == 3) {
              text = '{c|  100%}{f|  ' + params.data + '/' + total + '}'
            } else {
              text = '{d|  100%}{f|  ' + params.data + '/' + total + '}'
            }
            return text
          },
          rich: {
            a: {
              color: 'transparent'
            },
            b: {
              color: 'transparent'
            },
            c: {
              color: 'transparent'
            },
            d: {
              color: 'transparent'
            },
            f: {
              color: '#ffffff'
            }
          },
          position: 'right',
          distance: -20, // 向右偏移位置
          show: true
        }
      },
      data: datas,
      z: 0,
      animationEasing: 'elasticOut'
    },
    {
      name: '外框',
      type: 'bar',
      barGap: '-120%', // 设置外框粗细
      data: [total, total, total, total, total, total, total, total, total, total, total, total, total, total, total, total, total, total, total, total],
      barWidth: 25,
      itemStyle: {
        normal: {
          color: 'transparent', // 填充色
          barBorderColor: '#1C4B8E', // 边框色
          barBorderWidth: 1, // 边框宽度
          // barBorderRadius: 0, //圆角半径
          label: {
            // 标签显示位置
            show: false,
            position: 'top' // insideTop 或者横向的 insideLeft
          }
        }
      },
      z: 0
    }
    ]
  }
}

function setDepartmentElectricBar(data) {
  return {
    grid: {
      left: '5%',
      right: '15%',
      bottom: '2%',
      top: '5%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none'
      },
      formatter: function(params) {
        if (params[0].dataIndex > 2) {
          return params[0].name + '<br/>' +
            "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:rgba(36,207,233,0.9)'></span>" +
            params[0].seriesName + ' : ' + params[0].value + ' kW·h<br/>'
        } else {
          return params[0].name + '<br/>' +
            "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#ff773c'></span>" +
            params[0].seriesName + ' : ' + params[0].value + ' kW·h<br/>'
        }
      }
    },
    backgroundColor: 'transparent',
    xAxis: {
      show: false,
      type: 'value'
    },
    yAxis: {
      type: 'category',
      inverse: true,
      triggerEvent: true,
      // axisLabel: {
      //   show: true,
      //   textStyle: {
      //     color: '#009bfd'
      //   }
      // },
      axisLabel: {
        interval: 0,
        fontSize: '14',
        textStyle: {
          color: '#009bfd'
        },
        formatter: function(value) {
          var val = ''
          const maxLength = 4
          if (value.length > maxLength) {
            val = value.substr(0, maxLength) + '...'
            return val
          } else {
            return value
          }
        }
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      data: data.xdata
    },
    series: [
      {
        name: '用电',
        type: 'bar',
        zlevel: 1,
        itemStyle: {
          normal: {
            label: {
              formatter: function(value) {
                // dataIndex是序号，超过两个样式就是普通，前三样式不一样
                if (value.dataIndex > 2) {
                  if (value.data >= 10000) {
                    return '{m|' + (value.data / 10000).toFixed(2).toLocaleString() + '万kW·h}'
                  } else {
                    return '{m|' + value.data.toFixed(2).toLocaleString() + 'kW·h}'
                  }
                } else {
                  if (value.data >= 10000) {
                    return '{x|' + (value.data / 10000).toFixed(2).toLocaleString() + '万kW·h}'
                  } else {
                    if (value.data === 0) {
                      return '{m|' + value.data.toFixed(2).toLocaleString() + 'kW·h}'
                    } else {
                      return '{x|' + value.data.toFixed(2).toLocaleString() + 'kW·h}'
                    }
                  }
                }
              },
              show: true,
              position: 'right',
              distance: 5,
              textStyle: {
                fontSize: '12',
                color: '#fff'
              },
              rich: {
                b: {
                  color: '#ffffff',
                  fontSize: '16'
                },
                m: {
                  color: '#ffffff',
                  fontSize: '12'
                },
                x: {
                  color: '#ff7f35',
                  fontSize: '12'
                }
              }
            },
            color: function(params) {
              if (params.dataIndex > 2) {
                return new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                  offset: 0,
                  color: '#007fff'
                }, {
                  offset: 1,
                  color: '#00d2ff'
                }])
              } else {
                return new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                  offset: 0,
                  color: '#ffcf86'
                }, {
                  offset: 1,
                  color: '#ff773c'
                }])
              }
            }
          }
        },
        barWidth: 18,
        data: data.ydata
      }
    ]
  }
}

function setTimeBar(data) {
  return {
    backgroundColor: 'transparent',
    legend: {
      x: 'center',
      y: '2px',
      itemWidth: 25,
      itemHeight: 10,
      selectedMode: 'single',
      textStyle: {
        color: '#fff',
        fontSize: '10px'
      },
      data: ['用电', '用气', '用水']
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      top: '22%',
      right: '0%',
      left: '1%',
      bottom: '2%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      data: data.electric.data.xDatas,
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#205182'
        }
      },
      axisLabel: {
        margin: 10,
        color: '#e2e9ff',
        textStyle: {
          fontSize: 14,
          color: '#009bfd'
        }
      }
    }],
    yAxis: [
      {
        name: 'kW·h',
        type: 'value',
        nameTextStyle: {
          color: '#009bfd',
          fontSize: 14
        },
        splitNumber: 3,
        axisLine: {
          lineStyle: {
            color: '#205182'
          }
        },
        axisLabel: {
          color: '#e2e9ff',
          textStyle: {
            fontSize: 14,
            color: '#009bfd'
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        }
      }],
    series: [{
      type: 'bar',
      name: '用电',
      data: data.electric.data.yDatas,
      barWidth: '6px',
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#2afce1' // 0% 处的颜色
          }, {
            offset: 1,
            color: '#15c6ff' // 100% 处的颜色
          }], false),
          shadowColor: 'rgba(0,160,221,1)',
          shadowBlur: 4
        }
      }
    },
    {
      type: 'bar',
      name: '用气',
      data: data.gas.data.yDatas,
      barWidth: '6px',
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#2afce1' // 0% 处的颜色
          }, {
            offset: 1,
            color: '#15c6ff' // 100% 处的颜色
          }], false),
          shadowColor: 'rgba(0,160,221,1)',
          shadowBlur: 4
        }
      }
    },
    {
      type: 'bar',
      name: '用水',
      data: data.water.data.yDatas,
      barWidth: '6px',
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#2afce1' // 0% 处的颜色
          }, {
            offset: 1,
            color: '#15c6ff' // 100% 处的颜色
          }], false),
          shadowColor: 'rgba(0,160,221,1)',
          shadowBlur: 4
        }
      }
    }]
  }
}

function setTotalTrendLine(data) {
  return {
    backgroundColor: 'transparent',
    legend: {
      x: 'center',
      y: '6px',
      itemWidth: 20,
      itemHeight: 12,
      selectedMode: 'single',
      textStyle: {
        color: '#fff',
        fontSize: '10px'
      },
      data: ['用电', '用气', '用水']
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(0, 255, 233,0)'
            }, {
              offset: 0.5,
              color: 'rgba(255, 255, 255,1)'
            }, {
              offset: 1,
              color: 'rgba(0, 255, 233,0)'
            }],
            global: false
          }
        }
      }
    },
    grid: {
      top: '20%',
      left: '0%',
      right: '10%',
      bottom: '1%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#205182'
        }
      },
      splitArea: {
        color: '#f00',
        lineStyle: {
          color: '#f00'
        }
      },
      axisLabel: {
        color: '#009bfd'
      },
      splitLine: {
        show: false
      },
      boundaryGap: false,
      data: data.electric.data.xDatas

    }],

    yAxis: [{
      name: 'kW·h',
      nameTextStyle: {
        color: '#009bfd',
        fontSize: 14
      },
      type: 'value',
      min: 0,
      splitNumber: 4,
      splitLine: {
        show: false,
        lineStyle: {
          color: ['#fff'],
          opacity: 0.06
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#205182'
        }
      },
      axisLabel: {
        show: true,
        margin: 20,
        textStyle: {
          fontSize: 13,
          color: '#009bfd'
        }
      },
      axisTick: {
        show: false
      }
    }],
    series: [{
      name: '用电',
      type: 'line',
      smooth: true, // 是否平滑
      showAllSymbol: true,
      // symbol: 'image://./static/images/guang-circle.png',
      symbol: 'none',
      symbolSize: 10,
      lineStyle: {
        normal: {
          color: '#49d6e6',
          shadowColor: 'rgba(0, 0, 0, 0)',
          shadowBlur: 0,
          shadowOffsetY: 5,
          shadowOffsetX: 5
        }
      },
      label: {
        show: false,
        position: 'top',
        textStyle: {
          color: '#FFF',
          fontSize: 14
        }
      },
      itemStyle: {
        color: '#00b6eb',
        borderColor: '#194549',
        borderWidth: 0,
        shadowColor: 'rgba(0, 0, 0, 0)',
        shadowBlur: 0,
        shadowOffsetY: 0,
        shadowOffsetX: 0
      },
      tooltip: {
        show: true
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#194549ff'
          },
          {
            offset: 1,
            color: '#19454900'
          }
          ],
          global: false // 缺省为 false
        }
      },
      data: data.electric.data.yDatas
    }, {
      name: '用气',
      type: 'line',
      smooth: true, // 是否平滑
      showAllSymbol: true,
      // symbol: 'image://./static/images/guang-circle.png',
      symbol: 'none',
      symbolSize: 10,
      lineStyle: {
        normal: {
          color: '#00b6eb',
          shadowColor: 'rgba(0, 0, 0, 0)',
          shadowBlur: 0,
          shadowOffsetY: 5,
          shadowOffsetX: 5
        }
      },
      label: {
        show: true,
        position: 'top',
        textStyle: {
          color: '#FFF',
          fontSize: 14
        }
      },
      itemStyle: {
        color: '#00b6eb',
        borderColor: '#194549',
        borderWidth: 0,
        shadowColor: 'rgba(0, 0, 0, 0)',
        shadowBlur: 0,
        shadowOffsetY: 0,
        shadowOffsetX: 0
      },
      tooltip: {
        show: true
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#194549ff'
          },
          {
            offset: 1,
            color: '#19454900'
          }
          ],
          global: false // 缺省为 false
        }
      },
      data: data.gas.data.yDatas
    },
    {
      name: '用水',
      type: 'line',
      smooth: true, // 是否平滑
      showAllSymbol: true,
      // symbol: 'image://./static/images/guang-circle.png',
      symbol: 'none',
      symbolSize: 10,
      lineStyle: {
        normal: {
          color: '#00b6eb',
          shadowColor: 'rgba(0, 0, 0, 0)',
          shadowBlur: 0,
          shadowOffsetY: 5,
          shadowOffsetX: 5
        }
      },
      label: {
        show: true,
        position: 'top',
        textStyle: {
          color: '#FFF',
          fontSize: 14
        }
      },
      itemStyle: {
        color: '#00b6eb',
        borderColor: '#194549',
        borderWidth: 0,
        shadowColor: 'rgba(0, 0, 0, 0)',
        shadowBlur: 0,
        shadowOffsetY: 0,
        shadowOffsetX: 0
      },
      tooltip: {
        show: true
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#194549ff'
          },
          {
            offset: 1,
            color: '#19454900'
          }
          ],
          global: false // 缺省为 false
        }
      },
      data: data.water.data.yDatas
    }
    ]
  }
}

function setPeakPie(value) {
  var getname = value.name
  var getvalue = value.dataToday
  var total = value.total
  var data = []
  for (var i = 0; i < getname.length; i++) {
    if (getvalue[i] >= 0) {
      data.push({
        name: getname[i],
        value: (((getvalue[i] / total) * 100).toFixed(2)) / 100,
        data: getvalue[i]
      })
    }
  }
  var colorList = ['#8BF39A', '#27f5e6', '#00a0fe', '#b145d4', '#fd9e70', '#7724fb', '#b145d4', '#999933', '#ff00cc', '#ccff33', '#669900', '#ff66ff', '#6699ff']
  var rich = {
    name: {
      color: '#FFF',
      fontSize: 14,
      padding: [0, 0, 10, 0],
      fontWeight: '400',
      align: 'left'
    },
    value: {
      color: '#FFF',
      fontSize: 15,
      padding: [0, 0, 10, 5],
      fontWeight: '500',
      align: 'right'
    },
    percent: {
      color: '#FFF',
      align: 'right',
      fontSize: 15,
      fontWeight: '500'
    },
    hr: {
      width: '100%',
      height: 0
    },
    cir: {
      fontSize: 26
    }
  }
  // 职称结构图表

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      x: 'center',
      y: '0%',
      itemWidth: 20,
      itemHeight: 12,
      textStyle: {
        color: '#fff',
        fontSize: '12px'
      },
      data: getname
    },
    series: [{
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          // console.log(params)
          return params.name + '：' + params.data.data + 'kW·h<br>占比：' + params.percent.toFixed(2) + '%'
        }
      },
      itemStyle: {
        normal: {
          borderColor: 'transparent',
          borderWidth: 0,
          color: function(params) {
            return colorList[params.dataIndex]
          }
        }
      },
      type: 'pie',
      radius: ['30%', '60%'],
      center: ['50%', '63%'],
      label: {
        normal: {
          show: false,
          position: 'inner',
          formatter: params => {
            return (
              '{percent|' + params.percent.toFixed(0) + '%}'
            )
          },
          rich: rich
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: data
    }
    // , {
    //   itemStyle: {
    //     normal: {
    //       borderColor: '#0A1934',
    //       borderWidth: 5,
    //       color: function(params) {
    //         return colorList[params.dataIndex]
    //       }
    //     }
    //   },
    //   type: 'pie',
    //   silent: true, // 取消高亮
    //   radius: ['40%', '60%'],
    //   center: ['50%', '50%'],
    //   labelLine: {
    //     normal: {
    //       length: 30,
    //       length2: 30
    //     }
    //   },
    //   label: {
    //     normal: {
    //       formatter: params => {
    //         return '{name|' + params.name + '}{value|' + params.percent.toFixed(2) + '%}\n{hr|————————}'
    //       },
    //       rich: rich,
    //       padding: [-25, -10, 0, -10]
    //     }
    //   },
    //   data: data,
    //   z: -1
    // }, {
    //   itemStyle: {
    //     normal: {
    //       borderColor: '#0A1934',
    //       borderWidth: 5,
    //       color: function(params) {
    //         return colorList[params.dataIndex]
    //       }
    //     }
    //   },
    //   type: 'pie',
    //   silent: true, // 取消高亮
    //   radius: ['40%', '60%'],
    //   center: ['50%', '50%'],
    //   labelLine: {
    //     normal: {
    //       length: 30,
    //       length2: 0,
    //       lineStyle: {
    //         color: 'transparent'
    //       }
    //     }
    //   },
    //   label: {
    //     normal: {
    //       formatter: params => {
    //         return ''
    //       },
    //       rich: rich
    //     }
    //   },
    //   data: data,
    //   z: -1
    // }
    ]
  }
}

function setOnlineBar(online, offline) {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        label: {
          show: true
        }
      }
    },
    grid: {
      left: '1%',
      top: '18%',
      right: '6%',
      bottom: '2%',
      containLabel: true
    },
    legend: {
      data: ['在线数', '离线数'],
      top: '4%',
      textStyle: {
        color: '#1FC3CE',
        fontSize: 14
      }
    },
    xAxis: {
      data: [
        '电表',
        '气表',
        '水表'
      ],
      axisLine: {
        show: true, // 隐藏X轴轴线
        lineStyle: {
          color: '#009bfd',
          width: 1
        }
      },
      axisTick: {
        show: true, // 隐藏X轴刻度
        alignWithLabel: true
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: 'rgba(255,255,255,0.8)', // X轴文字颜色
          fontSize: 13
        },
        interval: 0,
        rotate: 0
      }
    },
    yAxis: [{
      type: 'value',
      name: '',
      nameTextStyle: {
        color: '#396A87',
        fontSize: 14
      },
      splitLine: {
        show: false,
        lineStyle: {
          width: 1,
          color: '#3d5269'
        }
      },
      minInterval: 1,
      axisTick: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#009bfd'
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#009bfd',
          fontSize: 14
        }
      }
    },
    {
      type: 'value',
      name: '',
      nameTextStyle: {
        color: '#396A87',
        fontSize: 14
      },
      minInterval: 1,
      position: 'right',
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#396A87',
          width: 2
        }
      },
      axisLabel: {
        show: true,
        formatter: '{value} %', // 右侧Y轴文字显示
        textStyle: {
          color: '#396A87',
          fontSize: 14
        }
      }
    }
    ],
    series: [
      {
        name: '在线数',
        type: 'bar',
        stack: '广告',
        barWidth: 18,
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#32dfff'
            },
            {
              offset: 1,
              color: '#007fff'
            }
            ])
          }
        },
        data: online
      },
      {
        name: '离线数',
        type: 'bar',
        stack: '广告',
        barWidth: 18,
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#ffcf84'
            },
            {
              offset: 1,
              color: '#ff8f5b'
            }
            ])
          }
        },
        data: offline
      }
    ]
  }
}

export default {
  echarts,
  initXDataArr,
  initYDataArr,
  setBar,
  setPie,
  setLine,
  setGauge,
  setHorizonBar,
  setDepartmentElectricBar,
  // 分时用能概况
  setTimeBar,
  setTotalTrendLine,
  setPeakPie,
  // 在线情况统计
  setOnlineBar
}
