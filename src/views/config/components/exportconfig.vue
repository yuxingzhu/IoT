<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="20" class="table-filter">
          <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>
            <el-form-item>
              <el-tooltip  content="新增">
                <el-button class="filter-item" icon="el-icon-plus" @click="openPartnerEditDialog('add', '')" />
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-input v-model.trim="listQuery.exportName" :maxlength="20" placeholder="输出配置名称" />
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
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="输出配置名称" prop="exportName" width="100" align="center" />
      <el-table-column label="输出目标类型" prop="exportTargetType" align="center" />
      <el-table-column label="地址" prop="address" width="100" align="center" />
      <el-table-column label="端口" prop="port" width="100" align="center" />
      <el-table-column label="主题/路径" prop="topic" width="80" align="center" />
      <el-table-column label="加密类型" prop="encryptionAlgorithm" align="center" />
      <el-table-column label="管理状态" prop="enable" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.enable ? 'unlock' : 'lock'" />
          {{ scope.row.enable ? "启用" : "禁用" }}
        </template>
      </el-table-column>
      <el-table-column  label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-tooltip content="修改" placement="bottom">
            <el-button size="small" icon="el-icon-edit" @click="openPartnerEditDialog('edit', scope.row)" class="elbuttondefault">修改</el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="bottom" style="margin-left: 1px">
            <el-button size="small" icon="el-icon-delete" @click="deletePartner(scope.row)" class="elbuttondefault">删除</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" :close-on-click-modal="false" style="width: 150%; margin-left: -19%" @close="closeEditDialog">
      <div style="margin-top: 0px">
        <el-form ref="resourceEditForm" :model="resourceEditForm" :rules="resourceEditRules" label-width="100px" size="mini" @submit.native.prevent>
          <fieldset
            style="
              padding: 10px;
              color: #00aa72;
              border-color: #ddd;
              border-width: 1px;
              -moz-border-radius: 5px;
              -webkit-border-radius: 5px;
              -khtml-border-radius: 5px;
              border-radius: 5px;
            "
          >
            <legend
              style="
                padding: 0 10px;
                font-size: 14px;
                line-height: inherit;
                white-space: normal;
              "
            >
              基础信息
            </legend>
            <el-row>
              <el-col :span="12">
                <el-form-item label="输出配置名称" prop="exportName">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.exportName" :maxlength="100" :placeholder="placeholder" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="输出目标类型" prop="exportTargetType">
                  <el-col :span="22">
                    <el-select v-model.trim="resourceEditForm.exportTargetType" :disabled="currentActionType === 'edit'" @change="changeType(resourceEditForm.exportTargetType)">
                      <el-option label="MQTT" value="MQTT_TOPIC" />
                      <el-option label="REST" value="REST_ENDPOINT" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="加密类型" prop="encryptionAlgorithm">
                  <el-col :span="22">
                    <el-select v-model.trim="resourceEditForm.encryptionAlgorithm">
                      <el-option label="不加密" value="" />
                      <el-option label="AES" value="AES" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="管理状态" prop="enable">
                  <el-col :span="22">
                    <el-select v-model.trim="resourceEditForm.enable">
                      <el-option label="禁用" :value="false" />
                      <el-option label="启用" :value="true" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </fieldset>

          <fieldset
            style="
              padding: 10px;
              color: #00aa72;
              margin-top: 10px;
              border-color: #ddd;
              border-width: 1px;
              -moz-border-radius: 5px;
              -webkit-border-radius: 5px;
              -khtml-border-radius: 5px;
              border-radius: 5px;
            "
          >
            <legend
              style="
                padding: 0 10px;
                font-size: 14px;
                line-height: inherit;
                white-space: normal;
              "
            >
              地址信息
            </legend>
            <el-row>
              <el-col :span="22">
                <el-form-item label="输出地址" prop="exportAddressParams">
                  <el-col :span="10" style="width: 41%">
                    <el-select v-model.trim="exportAddressParams" value-key="id" placeholder="请选择" @change="inputParams()">
                      <el-option v-for="item in exportAddressOptions" :key="item.id" :label="item.addressName" :value="item" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="地址" prop="address">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.address" :maxlength="100" :placeholder="placeholder" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="端口" prop="port">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.port" :maxlength="100" :placeholder="placeholder" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="resourceEditForm.exportTargetType === 'MQTT_TOPIC'">
              <el-col :span="12">
                <el-form-item label="用户名" prop="username">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.username" :maxlength="100" :placeholder="placeholder" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="秘钥" prop="password">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.password" type="password" :maxlength="100" :placeholder="placeholder" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="resourceEditForm.exportTargetType === 'REST_ENDPOINT'">
              <el-col :span="20">
                <el-form-item label="路径" prop="topic">
                  <el-col :span="22">
                    <el-input v-model.trim="resourceEditForm.topic" :maxlength="200" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="resourceEditForm.exportTargetType === 'MQTT_TOPIC'">
              <el-col :span="20">
                <el-form-item label="消息主题" prop="topic">
                  <el-col :span="22">
                    <el-select v-model.trim="resourceEditForm.topic" style="width: 100%">
                      <el-option v-for="item in dcDeviceTopiclist" :key="item.topicName" :label="item.topicName" :value="item.topicName" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </fieldset>
          <fieldset
            style="
              padding: 10px;
              color: #00aa72;
              border-color: #ddd;
              margin-top: 10px;
              border-width: 1px;
              -moz-border-radius: 5px;
              -webkit-border-radius: 5px;
              -khtml-border-radius: 5px;
              border-radius: 5px;
            "
          >
            <legend
              style="
                padding: 0 10px;
                font-size: 14px;
                line-height: inherit;
                white-space: normal;
              "
            >
              过滤条件
            </legend>
            <el-row>
              <el-col :span="12">
                <el-form-item label="设备描述" prop="deviceIdentifiers">
                  <el-col :span="22">
                    <el-select
                      v-model.trim="resourceEditForm.deviceIdentifiers"
                      class="el-block"
                      multiple
                      @change="
                        actionDeviceChange(resourceEditForm.deviceIdentifiers)
                      "
                    >
                      <el-option v-for="item in actionList" :key="item.deviceName" :label="item.deviceDesc" :value="item.deviceName" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备属性" prop="valueDescriptorIdentifiers">
                  <el-col :span="22">
                    <el-select v-model.trim="resourceEditForm.valueDescriptorIdentifiers" class="el-block" multiple>
                      <el-option v-for="item in commandList" :key="item" :label="item" :value="item" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </fieldset>
        </el-form>
      </div>
      <div slot="footer">
        <el-button icon="fa-ban" @click="closeEditDialog">取 消</el-button>
        <el-button type="primary" icon="fa-save" :loading="submiting" @click="saveResource">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getList,
  saveResource,
  updateResource,
  deletePartner,
  queryDeviceList,
  queryCommandFieldList,
  findAllTopic,
  getKey,
  getExportAddress
} from '@/api/exportconfig'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Exportconfig',
  components: { Pagination },
  data() {
    return {
      submiting: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        exportName: '',
        agwId: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      },
      length: 0,
      disabled: true,
      abled: true,
      editDialogVisible: false,
      resourceEditForm: {
        exportTargetType: 'MQTT_TOPIC',
        exportId: '',
        exportName: '',
        enable: true,
        enabled: true,
        addrName: '',
        protocol: '',
        method: '',
        ip: '',
        port: '',
        address: '',
        publisher: 'admin',
        username: '',
        password: '',
        topic: '',
        encryptionAlgorithm: '',
        encryptionKey: '',
        initializingVector: '',
        agwId: '',
        temTarget: '',
        deviceIdentifiers: '',
        valueDescriptorIdentifiers: '',
        nid: '',
        compression: 'NONE',
        configId: ''
      },
      resourceEditRules: {
        exportName: [
          {
            required: true,
            message: '请输入输出配置名称!',
            trigger: 'blur'
          }
        ],
        exportTargetType: [
          {
            required: true,
            message: '请选择目标类型!',
            trigger: 'change'
          }
        ],
        username: [
          {
            required: true,
            message: '请输入用户名!',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入秘钥!',
            trigger: 'blur'
          }
        ],
        address: [
          {
            required: true,
            message: '请输入地址!',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (
                !/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(
                  value
                )
              ) {
                callback('地址格式不正确！')
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        topic: [
          {
            validator: (rule, value, callback) => {
              if (
                this.resourceEditForm.exportTargetType === 'MQTT_TOPIC' &&
                value === ''
              ) {
                callback('请选择消息主题！')
              } else if (
                this.resourceEditForm.exportTargetType === 'REST_ENDPOINT' &&
                value === ''
              ) {
                callback('请输入路径！')
              }
              callback()
            },
            trigger: 'change'
          },
          { required: true, message: '请选择消息主题', trigger: 'change' }
        ],
        port: [
          {
            required: true,
            message: '请输入端口号!',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (!/^[0-9]*$/.test(value)) {
                callback('协议端口必须为1-65535！')
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
      },
      currentActionType: 'add',
      editDialogTitle: '',
      value: {},
      idList: [],
      deviceId: {
        nid: ''
      },
      placeholder: '',
      deviceList: [],
      edgeDeviceId: '',
      agwIds: {
        agwId: ''
      },
      conditionDeviceIds: {
        conditionDeviceId: ''
      },
      actionList: [],
      actionDeviceIds: {
        deviceNames: '',
        agwId: ''
      },
      commandList: {},
      actionCommandNames: {
        actionCommandName: '',
        actionDeviceId: ''
      },
      filter: [],
      dcDeviceTopiclist: [],
      exportAddressOptions: [],
      exportAddressParams: '',
      secretKey: ''
    }
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  created() {
    this.initParams()
    this.getList()
    this.queryDeviceList()
    this.findAllTopic()
    this.getKey()
    this.getExportAddress()
  },
  methods: {
    getExportAddress() {
      getExportAddress().then((res) => {
        if (res.success) {
          this.exportAddressOptions = res.data
        }
      })
    },
    getKey() {
      getKey().then((res) => {
        if (res.success) {
          this.secretKey = res.data.secretKey
        } else {
          this.secretKey = ''
        }
      })
    },
    initParams() {
      if (this.$route.query.edgeDeviceId !== undefined) {
        this.edgeDeviceId = this.$route.query.edgeDeviceId
      }
    },
    getList() {
      this.listLoading = true
      this.listQuery.agwId = this.edgeDeviceId
      getList(this.listQuery).then((response) => {
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
        this.idList.push(this.value.nid)
        this.deviceId.nid = this.idList.toString()
      }
      if (this.length > 1) {
        this.abled = false
        this.disabled = true
        for (var i = 0; i < this.length; i++) {
          this.idList.push(this.multipleSelection[i].nid)
        }
        this.deviceId.nid = this.idList.toString()
      }
      if (this.length === 0) {
        this.abled = true
        this.disabled = true
      }
    },
    resetQueryForm() {
      this.listQuery = {
        exportName: '',
        agwId: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      }
    },
    closeEditDialog() {
      this.editDialogVisible = false
      this.$refs.resourceEditForm.resetFields()
      this.multipleSelection = []
      this.resourceEditForm.topic = ''
      this.exportAddressParams = ''
      this.resourceEditForm.configId = ''
    },
    openPartnerEditDialog(actionType, row) {
      this.resourceEditForm.agwId = this.edgeDeviceId
      this.queryDeviceList()
      this.currentActionType = actionType
      if (this.currentActionType === 'add') {
        this.editDialogTitle = '新增输出配置'
      } else if (this.currentActionType === 'edit') {
        this.editDialogTitle = '修改输出配置'
        console.log(row)
        this.$nextTick(() => {
          this.resourceEditForm.nid = row.nid
          this.resourceEditForm.exportName = row.exportName
          this.resourceEditForm.exportTargetType = row.exportTargetType
          this.resourceEditForm.encryptionAlgorithm = row.encryptionAlgorithm
          this.resourceEditForm.addrId = row.addrId
          this.resourceEditForm.addrName = row.addrName
          this.resourceEditForm.protocol = row.protocol
          this.resourceEditForm.enable = row.enable
          this.resourceEditForm.address = row.address
          this.resourceEditForm.port = row.port
          this.resourceEditForm.username = row.username
          this.resourceEditForm.password = row.password
          this.resourceEditForm.topic = row.topic
          this.resourceEditForm.deviceIdentifiers = row.deviceIdentifiers
          this.actionDeviceChange(this.resourceEditForm.deviceIdentifiers)
          this.resourceEditForm.valueDescriptorIdentifiers =
            row.valueDescriptorIdentifiers
          this.resourceEditForm.encryptionKey = row.encryptionKey
          this.resourceEditForm.initializingVector = row.initializingVector
          this.resourceEditForm.issued = row.issued
          this.resourceEditForm.compression = row.compression
          this.exportAddressParams = {
            id: row.configId
          }
        })
      }
      this.editDialogVisible = true
    },
    saveResource() {
      if (this.resourceEditForm.topic === null) {
        this.resourceEditForm.topic = ''
      }
      this.$refs['resourceEditForm'].validate((valid) => {
        if (valid) {
          if (this.currentActionType === 'add') {
            if (this.resourceEditForm.exportTargetType === 'MQTT_TOPIC') {
              this.resourceEditForm.protocol = 'TCP'
            } else {
              this.resourceEditForm.protocol = 'HTTP'
              this.resourceEditForm.method = 'POST'
            }
            saveResource(this.resourceEditForm)
              .then((response) => {
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
              .catch((error) => {
                console.log(error)
              })
          } else {
            if (this.resourceEditForm.exportTargetType === 'MQTT_TOPIC') {
              this.resourceEditForm.method = ''
            } else {
              this.resourceEditForm.method = 'POST'
              this.resourceEditForm.username = ''
              this.resourceEditForm.password = ''
            }
            updateResource(this.resourceEditForm)
              .then((response) => {
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
              .catch((error) => {
                console.log(error)
              })
          }
        } else {
          return false
        }
      })
    },
    deletePartner(row) {
      this.$confirm('请确认是否删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deviceId.nid = row.nid
          deletePartner(this.deviceId)
            .then((response) => {
              if (response.success) {
                this.$notify({
                  message: '删除成功!',
                  type: 'success',
                  duration: this.$store.state.settings.duration
                })
                this.getList()
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '请求出错！'
                })
              }
            })
            .catch((error) => {
              console.log(error)
            })
        })
        .catch(() => {})
    },
    queryDeviceList() {
      this.agwIds.agwId = this.edgeDeviceId
      queryDeviceList(this.agwIds)
        .then((response) => {
          if (response.success) {
            this.actionList = response.data
          } else {
            this.actionList = []
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    actionDeviceChange(values) {
      if (Object.keys(values).length === 0) {
        this.resourceEditForm.deviceIdentifiers = []
        this.resourceEditForm.valueDescriptorIdentifiers = []
      } else {
        this.actionDeviceIds.deviceNames = values.join(',')
        this.actionDeviceIds.agwId = this.edgeDeviceId
        queryCommandFieldList(this.actionDeviceIds)
          .then((response) => {
            if (response.success) {
              this.commandList = response.data
            } else {
              this.commandList = []
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    findAllTopic() {
      findAllTopic()
        .then((response) => {
          if (response.success) {
            this.dcDeviceTopiclist = response.data
          } else {
            this.dcDeviceTopiclist = []
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    changeType(type) {
      this.resourceEditForm.username = 'sdada'
      if (type === 'REST_ENDPOINT') {
        this.resourceEditForm.method = 'POST'
        this.resourceEditForm.username = 'sss'
      } else {
        this.resourceEditForm.method = ''
        this.resourceEditForm.username = null
        this.resourceEditForm.password = null
      }
      this.resourceEditForm.topic = ''
    },
    inputParams() {
      this.resourceEditForm.address = this.exportAddressParams.ipAddress
      this.resourceEditForm.port = this.exportAddressParams.port
      this.resourceEditForm.username = this.$store.getters.realName
      this.resourceEditForm.password = this.secretKey
      this.resourceEditForm.configId = this.exportAddressParams.id
    }
  }
}
</script>
<style>
.el-divider__text {
  position: absolute;
  background-color: #fff;
  padding: 0 20px;
  color: #30313347;
}
.el-divider--horizontal {
  display: block;
  height: 2px;
  width: 100%;
  margin: 24px 0;
}
</style>

<style lang="scss" >
@import '~@/styles/variables.scss';
.el-loading-spinner.el-loading-text  {
  color: $el-loading-spinner;
  margin: 3px 0;
  font-size: 14px;
}
.el-loading-spinner i  {
  color: $el-loading-spinner;
}
</style>
