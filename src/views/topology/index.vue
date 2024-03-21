<template>
  <div class="dashboard-container">
    <div class="box-card">
      <div id="canvas" style="width:100%; height: 800px; border: solid 0 #2898E0" />
    </div>
    <el-dialog title="查看网关信息" :visible.sync="showHistoryDialog" :close-on-click-modal="false" style="width:150%;margin-left: -19%;" @close="closeHistoryDialog">
      <div class="diage">
        <template>
          <el-table ref="multipleTableA" v-loading="loadingFieldList" :show-header="false" :cell-style="columnStyle" border :data="tableData" size="mini" tooltip-effect="dark" style="width: 100%">
            <el-table-column prop="name" label="" width="200" align="center" />
            <el-table-column prop="names" label="" align="center" />
          </el-table>
        </template>
      </div>
      <div slot="footer">
        <el-button icon="fa-ban" @click="closeHistoryDialog">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看设备信息" :visible.sync="showDeviceDialog" :close-on-click-modal="false" style="width:150%;margin-left: -19%;" @close="closeDialog">
      <div class="diage">
        <template>
          <el-tabs v-model.trim="activeName" @tab-click="handleClick">
            <el-tab-pane label="设备详情" name="first">
              <el-table ref="multipleTableB" v-loading="loadingList" :show-header="false" :cell-style="columnStyle" border :data="deviceData" size="mini" tooltip-effect="dark" style="width: 100%" class="reading">
                <el-table-column prop="name" label="" width="200" align="center" />
                <el-table-column prop="names" label="" align="center" />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="数据采集" name="second">
              <el-table ref="multipleTableC" v-loading="loadingList" height="250" border :data="readingList" size="mini" tooltip-effect="dark" style="width: 100%">
                <el-table-column label="序号" type="index" width="80" align="center" />
                <el-table-column prop="name" label="属性" width="200" align="center" />
                <el-table-column prop="names" label="属性值" align="center" />
                <el-table-column prop="createTime" label="采集时间" align="center" />
              </el-table>

            </el-tab-pane>
          </el-tabs>
        </template>
      </div>
      <div slot="footer">
        <el-button icon="fa-ban" @click="closeDialog">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getList,
  findDevice,
  edgeDeviceByName,
  findDeviceByName
} from '@/api/topology'
import '@/api/js/qunee-min'
export default {
  components: {},
  data() {
    return {
      edgeList: [],
      neDeviceList: [],
      name: '',
      showHistoryDialog: false,
      loadingFieldList: false,
      tableData: [],
      edgeName: {
        edgeDeviceName: ''
      },
      loadingList: false,
      deviceData: [],
      showDeviceDialog: false,
      activeName: 'first',
      readingList: [],
      src: require('@/assets/flow.png')
    }
  },
  computed: {},
  mounted() {
    this.getList()
  },
  created() {},
  methods: {
    init(feEdgeList, deviceList) {
      const Q = window.Q
      const graph = new Q.Graph('canvas')
      var _this = this

      function FlowingSupport(graph) {
        this.flowMap = {}
        this.graph = graph
      }
      FlowingSupport.prototype = {
        flowMap: null,
        length: 0,
        gap: 660,
        graph: null,
        addFlowing: function(edgeOrLine, count, byPercent) {
          var flowList = this.flowMap[edgeOrLine.id]
          if (!flowList) {
            flowList = this.flowMap[edgeOrLine.id] = []
            this.length++
          }
          count = count || 1
          while (--count >= 0) {
            var ui = new Q.ImageUI(_this.src)
            console.info(ui)
            ui.layoutByPath = true
            ui.position = { x: 10, y: 0 }
            ui.size = { width: 30 }
            ui.renderColor = 'green'
            flowList.push(ui)
            flowList.byPercent = byPercent
            edgeOrLine.addUI(ui)
          }
        },
        removeFlowing: function(id) {
          var flowList = this.flowMap[id]
          if (!flowList) {
            return
          }
          var edgeOrLine = this.graph.getElement(id)
          if (edgeOrLine) {
            flowList.forEach(function(ui) {
              edgeOrLine.removeUI(ui)
            })
          }
          this._doRemove(id)
        },
        _doRemove: function(id) {
          delete this.flowMap[id]
          this.length--
        },
        timer: null,
        perStep: 10,
        stop: function() {
          clearTimeout(this.timer)
        },
        start: function() {
          if (this.timer) {
            clearTimeout(this.timer)
          }
          var offset = 0
          var index = 0
          var scope = this
          scope.timer = setTimeout(function A() {
            if (!scope.length) {
              scope.timer = setTimeout(A, 2000)
              offset = 0
              return
            }
            offset += -1
            for (var id in scope.flowMap) {
              var ui = scope.graph.getUI(id)
              if (!ui) {
                scope._doRemove(id)
                continue
              }
              var lineLength = ui.length
              if (!lineLength) {
                continue
              }
              var flowList = scope.flowMap[id]

              index++
              index = index % 42
              scope.flowMap[id].forEach(function(ui) {
                ui.position = { x: 0.5 + 0.02 * (22 - index), y: 0 }
              })

              scope.graph.invalidateUI(ui)

              var data = ui.data
              if (data instanceof Q.Edge) {
                if (data.getStyle(Q.Styles.EDGE_LINE_DASH)) {
                  data.setStyle(Q.Styles.EDGE_LINE_DASH_OFFSET, -offset)
                }
              } else if (data instanceof Q.ShapeNode) {
                if (data.getStyle(Q.Styles.SHAPE_LINE_DASH)) {
                  data.setStyle(Q.Styles.SHAPE_LINE_DASH_OFFSET, -offset)
                }
              }
            }
            scope.timer = setTimeout(A, 200)
          }, 200)
        }
      }

      graph.onclick = function(evt) {
        this.loadingFieldList = true
        const tooltip = evt.getData().tooltip.toString()
        const data = tooltip.split(':')[0]

        if (data === '网关名称') {
          const edgeDeviceName = tooltip.split(':')[1]
          console.info(edgeDeviceName)
          open(edgeDeviceName)
        } else if (data === '设备名称') {
          const deviceName = tooltip.split(':')[1]
          console.info(deviceName)
          openDevice(deviceName)
        }
      }
      function createNode(name, from) {
        const node = graph.createNode(name)
        return node
      }

      function createEdge(node, from) {
        const edge = graph.createEdge(from, node)
        return edge
      }

      function open(edgeDeviceName) {
        _this.showHistoryDialog = true
        _this.loadingFieldList = true
        edgeDeviceByName(edgeDeviceName).then((response) => {
          if (response.success) {
            _this.tableData = response.data
          } else {
            _this.tableData = []
          }
          _this.loadingFieldList = false
        })
      }
      function openDevice(deviceName) {
        _this.loadingList = true
        _this.showDeviceDialog = true
        findDeviceByName(deviceName).then((response) => {
          if (response.success) {
            _this.deviceData = response.data
            _this.readingList = response.readingList
          } else {
            _this.deviceData = []
            _this.readingList = response.readingList
          }
          _this.loadingList = false
        })
      }

      const root = createNode('')
      root.image = require('@/assets/pingtai.png') // 平台
      console.info(root)
      root.size = { width: 95 }
      root.tooltip = this.name
      root.anchorPosition = Q.Position.CENTER_TOP
      // var platFormEdge = createEdge(root, '')
      // platFormEdge.setStyle(Q.Styles.EDGE_COLOR, '#2898E0')
      root.parentChildrenDirection = Q.Consts.DIRECTION_BOTTOM
      for (var i = 0; i < feEdgeList.length; i++) {
        var node = createNode('', root) //  网关
        var nodeEdge = createEdge(node, root)
        if (!feEdgeList[i].status) {
          node.image = require('@/assets/edgeOff.png') // 离线
          node.setStyle(Q.Styles.RENDER_COLOR, '#E21667')
          node.setStyle(Q.Styles.SHADOW_COLOR, '#888')
          node.setStyle(Q.Styles.SHADOW_OFFSET_X, 5)
          node.setStyle(Q.Styles.SHADOW_OFFSET_Y, 5)
          node.setStyle(Q.Styles.SHADOW_BLUR, 5)

          nodeEdge.setStyle(Q.Styles.EDGE_COLOR, '#B9B9C1')
        } else {
          node.image = require('@/assets/edgeOn.png') // 在线
          nodeEdge.setStyle(Q.Styles.EDGE_COLOR, '#B9B9C1')

          nodeEdge.setStyle(Q.Styles.LINE_CAP, 'round')
          nodeEdge.setStyle(Q.Styles.EDGE_COLOR, '#2898E0')
          nodeEdge.setStyle(Q.Styles.EDGE_LINE_DASH, [8, 4, 1, 4])
          // nodeEdge.edgeType = Q.Consts.EDGE_TYPE_HORIZONTAL_VERTICAL
          var flowingSupport = new FlowingSupport(graph)

          flowingSupport.addFlowing(nodeEdge, 3)
        }
        node.size = { width: 60 }
        node.tooltip = '网关名称:' + feEdgeList[i].edgeDeviceName
        /**
          '网关名称：' +
          feEdgeList[i].edgeDeviceName +
          '</br>网关MAC：' +
          feEdgeList[i].mac +
          '</br>网关状态：' +
          (feEdgeList[i].status ? '在线' : '离线')*/

        node.parentChildrenDirection = Q.Consts.DIRECTION_BOTTOM
        node.layoutType = Q.Consts.LAYOUT_TYPE_EVEN
        for (var j = 0; j < deviceList.length; j++) {
          if (deviceList[j].agwId === feEdgeList[i].edgeDeviceId) {
            const device = createNode('', node) // 设备
            var deviceEdge = createEdge(device, node)
            if (deviceList[j].adminState !== 'UNLOCKED') {
              device.image = require('@/assets/deviceOn.png') // 在线
              deviceEdge.setStyle(Q.Styles.EDGE_COLOR, '#B9B9C1')
            } else {
              device.image = require('@/assets/deviceOff.png') // 离线
              deviceEdge.setStyle(Q.Styles.EDGE_COLOR, '#B9B9C1')
            }
            // deviceEdge.setStyle(Q.Styles.EDGE_LINE_DASH, [8, 4, 0.01, 4])
            device.size = { width: 40 }
            device.tooltip = '设备名称:' + deviceList[j].deviceName
            /**
              '设备名称：' +
              deviceList[j].deviceName +
              '</br>设备协议：' +
              deviceList[j].connectProtocol +
              '</br>设备状态：' +
              (deviceList[j].adminState === 'UNLOCKED' ? '在线' : '离线') */
          }
        }
      }

      graph.callLater(function() {
        flowingSupport.start()
      })

      function destroy() {
        flowingSupport.stop()
      }
      var layouter = new Q.TreeLayouter(graph)
      layouter.layoutType = Q.Consts.LAYOUT_TYPE_EVEN_HORIZONTAL
      layouter.doLayout({
        callback: function() {
          graph.zoomToOverview()
        }
      })
    },
    getList() {
      this.getName()
      getList().then((response) => {
        if (response.success) {
          this.edgeList = response.data
          this.neDeviceList = response.device
          this.init(this.edgeList, this.neDeviceList)
        } else {
          this.edgeList = []
          this.neDeviceList = []
        }
      })
    },
    getName() {
      findDevice().then((response) => {
        if (response.success) {
          this.name = response.data.titleName
        } else {
          this.name = '管理平台'
        }
      })
    },
    closeHistoryDialog() {
      this.showHistoryDialog = false
      this.tableData = []
    },
    closeDialog() {
      this.showDeviceDialog = false
      this.deviceData = []
      this.activeName = 'first'
    },
    handleClick(tab, event) {
      // console.log(tab)
    },
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return 'background:#F8F8F9;fontSize:12px;color: #515A6E;fontWeight:bold'
      }
    }
  }
}
</script>

<style>
.el-col-span {
  /**text-align: center;*/
  padding: 8px;
  padding-right: 1%;
}

.el-col-button {
  padding: 5%;
}
.font {
  font-size: 15px;
}
</style>
<style lang="scss" scoped>
.filter-container {
  height: calc(90vh - 100px);
}
.app-container {
  height: calc(90vh - 100px);
  color: rgba(96, 92, 92, 0.71);
  font-size: 14px;
  font-family: 'Microsoft YaHei';
  margin-top: 0px;
  background-color: #fff;
}
.reading {
  td {
    .el-table_1_column_1 {
      background-color: red;
    }
  }
}
</style>
<style lang="scss" >
.reading > td {
  .el-table_1_column_1 {
    background-color: red !important;
  }
}
.diage {
      .el-table--group,
      .el-table--border {
        border: 1px solid #dfe6ec !important;
      }
      .el-table--border th,
      .el-table--border td {
        border-right: 1px solid #dfe6ec !important;
      }
      .el-table th.is-leaf,
      .el-table td {
        border-bottom: 1px solid #dfe6ec !important;
      }
    }
</style>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.dashboard {
  &-container {
    background-color: transparent;
    .box-card {
      background-color: $card-border-color;
    }
    .diage {
      .el-table--group,
      .el-table--border {
        border: 1px solid #dfe6ec !important;
      }
      .el-table--border th,
      .el-table--border td {
        border-right: 1px solid #dfe6ec !important;
      }
      .el-table th.is-leaf,
      .el-table td {
        border-bottom: 1px solid #dfe6ec !important;
      }
    }
  }
}
</style>
