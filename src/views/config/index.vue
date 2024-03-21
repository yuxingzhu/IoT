<template>
  <div class="config-container">
    <div style="height:100px;width:100%;background-color: #fff;padding: 20px;">
      <el-row>
        <el-col :span="19" style="font-size: 13px;font-weight: 400;font-family: 'Microsoft YaHei'">
          网关名称：{{ feEdgeDevice.edgeDeviceName }}
        </el-col>
        <el-col :span="5" style="text-align: right;">
          <el-button type="primary" @click="openFullScreen">部署</el-button>
          <el-button type="primary" @click="deploy">部署记录</el-button>
        </el-col>
      </el-row>
      <el-row style="color:rgba(96, 92, 92, 0.71);font-size: 12px;font-family: 'Microsoft YaHei';margin-top: 5px;">
        <el-col :span="4">
          网关状态： {{ feEdgeDevice.status?'在线' : '离线' }}
        </el-col>
        <el-col :span="10">
          <span v-if="createTime !== ''">最近部署成功时间：</span>{{ createTime }}
        </el-col>
      </el-row>
    </div>
    <el-dialog :title="editDialogTitle" :visible.sync="viewConfigDialogVisible" :close-on-click-modal="false" style="width:226%;margin-left: -56%;" @close="closePartnerViewConfigDialog">
      <el-table ref="multipleTable" v-loading="listLoading" :data="list" stripe size="mini" style="width: 100%;">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="">
                <span>{{ props.row.deployMessage }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column v-if="type==1" label="部署网关" prop="edgeName" align="center" />
        <el-table-column v-if="type==2" label="部署节点" prop="edgeName" align="center" />
        <el-table-column label="部署方式" prop="deployWay" align="center">
          <template slot-scope="scope">
            {{ scope.row.deployWay === 0?'自动':'手动' }}
          </template>
        </el-table-column>
        <el-table-column label="部署结果" prop="deployResult" align="center">
          <template slot-scope="scope">
            {{ scope.row.deployResult === 0?'成功':( scope.row.deployResult === 1?'失败':'待部署') }}
          </template>
        </el-table-column>
        <el-table-column label="部署者" prop="userName" align="center" />
        <el-table-column label="部署时间" prop="deployTime" width="150" align="center" />
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <div slot="footer">
        <el-button icon="fa-ban" @click="closePartnerViewConfigDialog">取 消</el-button>
      </div>
    </el-dialog>
    <el-tabs v-if="type == 1" v-model.trim="activeName" style="background-color: #fff;margin-top: 10px;">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key" />
      <component :is="activeName" />
    </el-tabs>
    <el-tabs v-if="type == 2" v-model.trim="activeName" style="background-color: #fff;margin-top: 10px;">
      <el-tab-pane v-for="item in tabMapOption" :key="item.key" :label="item.label" :name="item.key" />
      <component :is="activeName" />
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import device from './components/device'
import rule from './components/rule'
import exportconfig from './components/exportconfig'
import Pagination from '@/components/Pagination'
import necacheconfig from './components/necacheconfig'
import netask from './components/netask'
import {
  flushEdgeAgw,
  flushNodeAgw,
  offLIneEdgeAgw,
  findTaskByAgwId,
  getList
} from '@/api/config'
export default {
  name: 'Config',
  components: {
    device,
    rule,
    exportconfig,
    Pagination,
    necacheconfig,
    netask
  },
  data() {
    return {
      edgeDeviceId: '',
      agwIdList: {
        agwId: ''
      },
      tabMapOptions: [
        { label: '设备管理', key: 'device' },
        { label: '规则管理', key: 'rule' },
        { label: '输出配置', key: 'exportconfig' },
        { label: '任务调度', key: 'netask' },
        { label: '缓存配置', key: 'necacheconfig' }
      ],
      tabMapOption: [
        { label: '设备管理', key: 'device' },
        { label: '输出配置', key: 'exportconfig' }
      ],
      activeName: 'device',
      deployTasks: {},
      feEdgeDevice: {},
      createTime: '',
      editDialogTitle: '',
      viewConfigDialogVisible: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        deployEdge: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'deployTime',
        order: 'desc'
      },
      type: '',
      status: ''
    }
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  watch: {
    activeName(val) {
      this.$router.push(
        `${this.$route.path}?tab=${val}&edgeDeviceId=${this.edgeDeviceId}&type=${this.type}`
      )
    }
  },
  created() {
    this.edgeDeviceId = this.$route.query.edgeDeviceId
    this.type = this.$route.query.type
    // init the default  selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
    this.findTaskByAgwId()
  },
  methods: {
    findTaskByAgwId() {
      this.agwIdList.agwId = this.edgeDeviceId
      findTaskByAgwId(this.agwIdList)
        .then(response => {
          if (response.success) {
            this.deployTasks = response.data
            if (this.deployTasks !== null) {
              this.createTime = this.deployTasks.executeTime
            }
            this.feEdgeDevice = response.edge
            this.status = this.feEdgeDevice.status
          } else {
            this.dcDeviceTopiclist = []
            this.createTime = ''
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    flushEdgeAgw() {
      this.agwIdList.agwId = this.edgeDeviceId
      flushEdgeAgw(this.agwIdList)
        .then(response => {
          if (response.success) {
            if (response.msg !== '网关离线') {
              if (response.success) {
                this.$notify({
                  message: '网关部署成功!',
                  type: 'success',
                  duration: this.$store.state.settings.duration
                })
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '网关部署失败！'
                })
              }
              this.findTaskByAgwId()
            } else {
              this.$confirm(
                '该网关不在线，部署任务将在网关上线后自行执行，请确认是否执行？',
                '提示',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }
              )
                .then(() => {
                  offLIneEdgeAgw(this.agwIdList).then(response => {
                    if (response.success) {
                      this.$notify({
                        message: '网关进入待部署状态!',
                        type: 'success',
                        duration: this.$store.state.settings.duration
                      })
                    } else {
                      this.$notify.error({
                        title: '错误',
                        message: '请求出错！'
                      })
                    }
                  })
                })
                .catch(() => {})
              this.findTaskByAgwId()
            }
          } else {
            this.$notify.error({
              title: '错误',
              message: '请求出错！'
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    deploy() {
      this.editDialogTitle = '部署记录'
      this.listQuery.deployEdge = this.edgeDeviceId
      this.viewConfigDialogVisible = true
      this.getList()
    },
    getList() {
      this.listQuery.deployEdge = this.edgeDeviceId
      this.listLoading = true
      getList(this.listQuery).then(response => {
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
    closePartnerViewConfigDialog() {
      this.viewConfigDialogVisible = false
      this.listQuery = {
        deployEdge: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'deployTime',
        order: 'desc'
      }
    },
    openFullScreen() {
      if (this.type === '1') {
        const loading = this.$loading({
          lock: true,
          text: '正在部署中...',
          fontSize: '100px',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.agwIdList.agwId = this.edgeDeviceId
        flushEdgeAgw(this.agwIdList)
          .then(response => {
            if (response.success) {
              if (response.msg !== '网关离线') {
                if (response.success) {
                  loading.close()
                  this.$notify({
                    message: '网关部署成功!',
                    type: 'success',
                    duration: this.$store.state.settings.duration
                  })
                } else {
                  loading.close()
                  this.$notify.error({
                    title: '错误',
                    message: '网关部署失败！'
                  })
                }
                this.findTaskByAgwId()
              } else {
                loading.close()
                this.$confirm(
                  '该网关不在线，部署任务将在网关上线后自行执行，请确认是否执行？',
                  '提示',
                  {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }
                )
                  .then(() => {
                    offLIneEdgeAgw(this.agwIdList).then(response => {
                      if (response.success) {
                        loading.close()
                        this.$notify({
                          message: '网关进入待部署状态!',
                          type: 'success',
                          duration: this.$store.state.settings.duration
                        })
                      } else {
                        loading.close()
                        this.$notify.error({
                          title: '错误',
                          message: '请求出错！'
                        })
                      }
                    })
                  })
                  .catch(() => {
                    loading.close()
                  })
                this.findTaskByAgwId()
              }
            } else {
              loading.close()
              this.$notify.error({
                title: '错误',
                message: '请求出错！'
              })
            }
          })
          .catch(error => {
            loading.close()
            console.log(error)
          })
      } else if (this.type === '2') {
        if (!this.status) {
          this.$notify({
            message: '节点不在线，暂无法部署!',
            type: 'warning'
          })
        } else {
          const loading = this.$loading({
            lock: true,
            text: '正在部署中...',
            fontSize: '100px',
            spinner: 'el-icon-loading',
            spinnerColor: 'red',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          this.agwIdList.agwId = this.edgeDeviceId
          flushNodeAgw(this.agwIdList)
            .then(response => {
              if (response.success) {
                loading.close()
                this.$notify({
                  message: '节点部署成功!',
                  type: 'success',
                  duration: this.$store.state.settings.duration
                })
              } else {
                loading.close()
                this.$notify.error({
                  title: '错误',
                  message: '节点部署失败！'
                })
              }
              this.findTaskByAgwId()
            })
            .catch(error => {
              loading.close()
              console.log(error)
            })
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import "~@/styles/variables.scss";
.el-tabs__header.is-top {
  padding: 5px 20px 0;
  margin-bottom: 0;
}
.el-loading-spinner .el-loading-text {
  color: $el-loading-spinner;
  margin: 3px 0;
  font-size: 14px;
}
.el-loading-spinner i {
  color: $el-loading-spinner;
}
</style>
