<template>
  <div>
    <div v-if="!isChildren" class="app-container">
      <div class="filter-container">
        <el-row>
          <el-col :span="20" class="table-filter">
            <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
              <el-form-item>
                <el-tooltip  content="新增">
                  <el-button class="filter-item" icon="el-icon-plus" @click="opendataConfigEditDialog('add','')" />
                </el-tooltip>
              </el-form-item>
              <el-form-item>
                <el-input v-model.trim="listQuery.configName" :maxlength="20" placeholder="策略名称" />
              </el-form-item>
              <el-form-item>
                <el-tooltip content="重置">
                  <el-button icon="el-icon-refresh" @click="resetQueryForm" />
                </el-tooltip>
                <el-tooltip content="搜索">
                  <el-button icon="el-icon-search" @click="getList" />
                </el-tooltip>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <el-table ref="multipleTable" v-loading="listLoading" :data="list" stripe size="mini" tooltip-effect="dark" style="width: 100%">
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="策略名称" prop="configName" align="center" />
        <el-table-column label="创建时间" prop="createTime" width="260" align="center" />
        <el-table-column label="操作" width="260" align="center">
          <template slot-scope="scope">
            <el-tooltip content="修改" placement="bottom" >
              <el-button size="small" icon="el-icon-edit" @click="opendataConfigEditDialog('edit',scope.row)" class="elbuttondefault"/>
            </el-tooltip>
            <el-tooltip content="策略下发" placement="bottom" style="margin-left:1px" >
              <el-button size="small" icon="el-icon-connection" @click="openSendDialog(scope.row)" class="elbuttondefault"/>
            </el-tooltip>
            <el-tooltip content="策略配置" placement="bottom" style="margin-left:1px" >
              <el-button size="small" icon="el-icon-setting" @click="jumpToFilter(scope.row)" class="elbuttondefault"/>
            </el-tooltip>
            <el-tooltip content="下发历史" placement="bottom" style="margin-left:1px">
              <el-button size="small" icon="el-icon-notebook-2" @click="getHistory(scope.row)" class="elbuttondefault"/>
            </el-tooltip>
            <el-tooltip content="删除" placement="bottom" style="margin-left:1px" >
              <el-button size="small" icon="el-icon-delete" @click="deletedataConfig(scope.row)" class="elbuttondefault"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" :close-on-click-modal="false" @close="closeEditDialog">
        <div>
          <el-form ref="dataConfigEditForm" :model="dataConfigEditForm" :rules="dataConfigEditRules" label-width="100px" size="mini" @submit.native.prevent>
            <el-row>
              <el-col :span="20">
                <el-form-item label="策略名称" prop="configName">
                  <el-col :span="22">
                    <el-input v-model.trim="dataConfigEditForm.configName" :maxlength="70" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeEditDialog">取 消</el-button>
          <el-button type="primary" icon="fa-save" :loading="submiting" @click="savedataConfig">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="editDialogTitle" :visible.sync="sendConfigDialogVisible" :close-on-click-modal="false" style="width:150%;margin-left: -19%;" @close="closeSendConfigDialog">
        <div>
          <template>
            <el-table ref="multipleTable" :data="edgeDeviceList" style="width: 100%;" size="mini" @selection-change="selectionChange">
              <el-table-column type="selection" width="100" />
              <el-table-column prop="edgeDeviceName" label="网关名称" />
              <el-table-column prop="ipAddress" label="IP地址" width="180" show-overflow-tooltip />
              <el-table-column prop="mac" label="MAC地址" show-overflow-tooltip />
            </el-table>
          </template>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeSendConfigDialog">关 闭</el-button>
          <el-button type="primary" icon="fa-save" :loading="submiting" @click="sendToEdgeDevice">下 发</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="sendTitle" :visible.sync="sendResultDialogVisible" :close-on-click-modal="false" style="width:150%;margin-left: -19%;" @close="closeResultConfigDialog">
        <div>
          <template>
            <el-table ref="multipleTableA" :data="resultList" style="width: 100%;" size="mini">
              <el-table-column label="序号" type="index" width="50" align="center" />
              <el-table-column prop="returnData" label="下发结果" align="center" />
            </el-table>
          </template>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeResultConfigDialog">关 闭</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="historyTitle" :visible.sync="showHistoryDialog" :close-on-click-modal="false" style="width:150%;margin-left: -19%;" @close="closeHistoryDialog">
        <div>
          <template>
            <el-table ref="multipleTableB" v-loading="loadingFieldList" :data="tableData" stripe size="mini" tooltip-effect="dark" style="width: 100%">
              <el-table-column label="序号" type="index" width="80" align="center" />
              <el-table-column prop="edgeDeviceName" label="下发网关" width="200" align="center" />
              <el-table-column prop="sendStatus" label="下发结果" width="150" align="center" />
              <el-table-column prop="createTime" label="下发时间" align="center" />
            </el-table>
            <pagination v-show="fieldQueryTotal>0" :total="fieldQueryTotal" :page.sync="fieldQueryForm.currentPage" :limit.sync="fieldQueryForm.pageSize" @pagination="getHistorys" />
          </template>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeHistoryDialog">关 闭</el-button>
        </div>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getList,
  savedataConfig,
  editdataConfig,
  deletedataConfig,
  loadAllEdgeDevice,
  sendToEdgeDevice,
  getHistory
} from '@/api/datafilterConfig'
import Pagination from '@/components/Pagination'
export default {
  name: 'DatafilterConfig',
  components: { Pagination },
  data() {
    return {
      submitFlag: false,
      submiting: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        configName: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      },
      edgeDeviceId: '',
      configId: '',
      type: true,
      idList: [],
      length: 0,
      disabled: true,
      abled: true,
      editDialogVisible: false,
      currentActionType: '',
      editDialogTitle: '',
      dataSourceType: '',
      configIds: {
        configId: ''
      },
      historyRow: [],
      value: {},
      dataConfigEditForm: {
        configId: '',
        configName: '',
        enabled: '',
        enableAlarm: ''
      },
      dataConfigEditRules: {
        enabled: [
          {
            required: true,
            message: '请选择启用状态!',
            trigger: 'change'
          }
        ],
        configName: [
          {
            required: true,
            message: '请输出策略名称!',
            trigger: 'blur'
          }
        ]
      },
      sendConfigDialogVisible: false,
      edgeDeviceList: {},
      multipleSelection: [],
      selection: [],
      sendResultDialogVisible: false,
      resultList: [],
      sendTitle: '下发结果',
      sendParms: {
        configId: '',
        sendEdgeDeviceStr: ''
      },
      sendEdgeDeviceList: [],
      temStr: '',
      tableData: [],
      showHistoryDialog: false,
      fieldQuering: false,
      loadingFieldList: false,
      fieldQueryForm: {
        configId: '',
        pageSize: 10,
        currentPage: 1,
        orderby: 'createTime',
        order: 'desc'
      },
      historyTitle: '策略下发历史',
      fieldQueryTotal: 0
    }
  },
  watch: {
    sendConfigDialogVisible(val) {
      if (!val && this.$refs['multipleTable']) {
        this.$refs['multipleTable'].clearSelection()
      }
    },
    closeSendConfigDialog(val) {
      if (!val && this.$refs['installDataForm']) {
        this.$refs['multipleTable'].clearSelection()
        this.$refs['installDataForm'].resetFields()
      }
    }
  },
  created() {
    this.isChildren = this.$route.meta.isChildren
    this.getList()
    this.loadAllEdgeDevice()
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.agwId = this.edgeDeviceId
      getList(this.listQuery).then(response => {
        if (response.success) {
          this.list = response.data
          this.total = response.totalRowCount
        } else {
          this.list = []
          this.total = []
        }
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    handleClick(tab, event) {
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.length = this.multipleSelection.length
      this.idList = []
      if (this.length === 1) {
        this.disabled = false
        this.abled = false
        this.value = this.multipleSelection[0]
        this.idList.push(this.value.configId)
        this.configIds.configId = this.idList.toString()
      }
      if (this.length > 1) {
        this.abled = false
        this.disabled = true
        for (var i = 0; i < this.length; i++) {
          this.idList.push(this.multipleSelection[i].configId)
          this.configIds.configId = this.idList.toString()
        }
      }
      if (this.length === 0) {
        this.abled = true
        this.disabled = true
      }
    },
    selectionChange(val) {
      this.selection = val
    },
    resetQueryForm() {
      this.listQuery = {
        configName: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      }
    },
    handlePartnerCmd(cmd) {
      if (cmd === 'send') {
        this.editDialogTitle = '策略下发'
        this.openSendDialog(this.value)
      } else if (cmd === 'filter') {
        this.jumpToFilter(this.value)
      }
    },
    opendataConfigEditDialog(actionType, row) {
      this.currentActionType = actionType
      this.dataConfigEditForm.enabled = 1
      this.dataConfigEditForm.enableAlarm = 0
      this.editDialogVisible = true
      if (this.currentActionType === 'add') {
        this.editDialogTitle = '新增清洗策略'
      } else if (this.currentActionType === 'edit') {
        this.editDialogTitle = '修改清洗策略'
        this.dataConfigEditForm.configId = row.configId
        this.dataConfigEditForm.configName = row.configName
        if (row.enabledStr === '启用') {
          this.dataConfigEditForm.enabled = 1
        } else {
          this.dataConfigEditForm.enabled = 0
        }
        if (row.enableAlarmStr === '开启') {
          this.dataConfigEditForm.enableAlarm = 1
        } else {
          this.dataConfigEditForm.enableAlarm = 0
        }
      }
    },
    closeEditDialog() {
      this.editDialogVisible = false
      this.$refs.dataConfigEditForm.resetFields()
      this.dataConfigEditForm.configId = ''
      this.dataConfigEditForm.configName = ''
    },
    closeResultConfigDialog() {
      this.sendResultDialogVisible = false
    },
    savedataConfig() {
      this.$refs['dataConfigEditForm'].validate(valid => {
        if (valid && !this.submitFlag) {
          this.submitFlag = true
          if (this.currentActionType === 'add') {
            savedataConfig(this.dataConfigEditForm)
              .then(response => {
                this.submitFlag = false
                if (response.success) {
                  this.$notify({
                    message: '保存成功',
                    type: 'success',
                    duration: this.$store.state.settings.duration
                  })
                  this.closeEditDialog()
                  this.getList()
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: '请求出错！'
                  })
                }
              })
              .catch(error => {
                console.log(error)
                this.submitFlag = false
              })
          } else {
            editdataConfig(this.dataConfigEditForm)
              .then(response => {
                this.submitFlag = false
                if (response.success) {
                  this.$notify({
                    message: '保存成功',
                    type: 'success',
                    duration: this.$store.state.settings.duration
                  })
                  this.closeEditDialog()
                  this.getList()
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: '请求出错！'
                  })
                }
              })
              .catch(error => {
                console.log(error)
                this.submitFlag = false
              })
          }
        } else {
          return false
        }
      })
    },
    deletedataConfig(row) {
      this.$confirm('请确认是否删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.configIds.configId = row.configId
          deletedataConfig(this.configIds)
            .then(response => {
              if (response.success) {
                this.$notify({
                  message: '删除成功!',
                  type: 'success',
                  duration: this.$store.state.settings.duration
                })
                this.getList()
                this.loadAllMode()
                this.connectionType = ''
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
        })
        .catch(() => {})
    },
    openSendDialog(row) {
      this.editDialogTitle = '策略下发'
      this.configId = row.configId
      this.sendConfigDialogVisible = true
    },
    loadAllEdgeDevice() {
      loadAllEdgeDevice()
        .then(response => {
          if (response.success) {
            this.edgeDeviceList = response.data
          } else {
            this.edgeDeviceList = []
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    jumpToFilter(row) {
      this.$router.push(`/filterConfig?configId=${row.configId}`)
    },
    closeSendConfigDialog() {
      this.$refs.multipleTable.clearSelection()
      this.sendConfigDialogVisible = false
    },
    sendToEdgeDevice(row) {
      if (
        this.selection.length === 0 ||
        this.selection === [] ||
        this.selection === ''
      ) {
        this.$notify({
          title: '警告',
          message: '下发失败，请选择网关！',
          type: 'warning'
        })
        this.closeSendConfigDialog()
      } else {
        const loading = this.$loading({
          lock: true,
          text: '正在下发中...',
          fontSize: '100px',
          spinner: 'el-icon-loading',
          spinnerColor: 'red',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        this.sendParms.configId = this.configId
        for (var i = 0; i < this.selection.length; i++) {
          this.sendEdgeDeviceList[i] = this.selection[i].edgeDeviceId
        }
        this.temStr = JSON.stringify(this.sendEdgeDeviceList)
        this.sendParms.sendEdgeDeviceStr = this.temStr.substring(
          1,
          this.temStr.length - 1
        )
        sendToEdgeDevice(this.sendParms)
          .then(response => {
            if (response.success) {
              loading.close()
              this.sendResultDialogVisible = true
              this.resultList = response.resultData
            } else {
              loading.close()
              this.resultList = []
              this.$notify.error({
                title: '错误',
                message: '下发失败！'
              })
            }
          })
          .catch(error => {
            loading.close()
            console.log(error)
          })
        this.$refs.multipleTable.clearSelection()
        this.sendConfigDialogVisible = false
      }
    },
    getHistory(row) {
      this.showHistoryDialog = true
      this.fieldQueryForm.configId = row.configId
      getHistory(this.fieldQueryForm).then(response => {
        if (response.success) {
          this.tableData = response.data
          this.fieldQueryTotal = response.totalRowCount
        } else {
          this.tableData = []
          this.fieldQueryTotal = 0
        }
        this.loadingFieldList = false
      })
    },
    getHistorys() {
      this.showHistoryDialog = true
      getHistory(this.fieldQueryForm).then(response => {
        if (response.success) {
          this.tableData = response.data
          this.fieldQueryTotal = response.totalRowCount
        } else {
          this.tableData = []
          this.fieldQueryTotal = 0
        }
        this.loadingFieldList = false
      })
    },
    closeHistoryDialog() {
      this.showHistoryDialog = false
      this.fieldQueryForm = {
        configId: '',
        pageSize: 10,
        currentPage: 1,
        orderby: 'createTime',
        order: 'desc'
      }
    }
  }
}
</script>
<style >
.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 24px 0;
}
.el-divider__text,
.el-link {
  font-weight: 500;
  font-size: 16px;
}
.el-divider__text {
  position: absolute;
  background-color: #fff;
  padding: 0 20px;
  color: #303133a1;
}
.el-loading-spinner .el-loading-text {
  color: #00c3c4 !important;
  margin: 3px 0;
  font-size: 14px;
}
.el-loading-spinner i {
  color: #00c3c4 !important;
}
</style>
